/*
 * =============================================================
 * elliptical.$OData
 * =============================================================
 * for odata v4
 * 
 * supports common odata queries
 * supports navigation,complex queries as pass throughs
 * 
 * e.g
 *  can take a standard url query: ?c_Name=Book&cq_12=Filters/any(d:d/id eq 5)
 *  and convert into odata format-->$filter=contains(Name%2C%27Book%27)%20and%20Filters%2Fany(d%3Ad%2FId%20eq%2012)&$top=12&$count=true
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./provider'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.$OData = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$OData;
    }
}(this, function (Provider) {

    var $OData;
    $OData = Provider.extend({

        /**
         *
         * @param {string} endpoint
         * @param {*} filter
         * @returns {string}
         */
        filter: function (endpoint, filter) {
            if (typeof filter === 'object') filter = this._getFilterString(filter);
            if(filter && filter !==''){
                var encodedFilter = '$filter=' + encodeURIComponent(filter);
                return (endpoint.indexOf('?') > -1) ? '&' + encodedFilter : '?' + encodedFilter;
            }else return '';
            
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} orderBy
         * @returns {string}
         * @public
         */
        orderBy: function (endpoint, orderBy) {
            var encodedOrderBy = '$orderby=' + encodeURIComponent(orderBy);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderBy : '?' + encodedOrderBy;
        },

        /**
         *
         * @param endpoint
         * @param orderBy
         * @param orderByDesc
         * @returns {string}
         * @public
         */
        orderByDesc: function (endpoint, orderBy, orderByDesc) {
            if (orderBy !== undefined) return ', ' + encodeURIComponent(orderByDesc + ' desc');
            else {
                var encodedOrderByDesc = '$orderby=' + encodeURIComponent(orderByDesc + ' desc');
                return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderByDesc : '?' + encodedOrderByDesc;
            }
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} top
         * @returns {string}
         * @public
         */
        top: function (endpoint, top) {
            var encodedTop = '$top=' + top;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedTop : '?' + encodedTop;
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} skip
         * @returns {string}
         * @public
         */
        skip: function (endpoint, skip) {
            var encodedSkip = '$skip=' + skip;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedSkip : '?' + encodedSkip;
        },

        /**
         *
         * @param {string} endpoint
         * @param {object} params
         * @returns {string}
         * @public
         */
        paginate: function (endpoint, params) {
            var page = params.page,
                pageSize = params.pageSize,
                skip,
                encodedPaginate;

            if (typeof page === 'undefined' || typeof pageSize === 'undefined') return endpoint;
            else {
                page--;
                skip = page * pageSize;
                encodedPaginate = (skip > 0) ? '$skip=' + skip + '&$top=' + pageSize + '&$count=true' : '$top=' + pageSize + '&$count=true';
                return (endpoint.indexOf('?') > -1) ? '&' + encodedPaginate : '?' + encodedPaginate;
            }
        },

        _getFilterString: function (query) {
            /*
             default:[field] eq [value]

             sw_[field]==startswith
             swl_[field]==startswith, tolower
             swu_[field]==startswith, toupper
             c_[field]==contains
             cl_[field]==contains,tolower
             cu_[field]==contains,toupper
             ew_[field]==endswith
             ewl_[field]==endswith,tolower
             ewu_[field]==endswith,toupper
             eql_[field]==eq, tolower
             equ_[field]==eq,toupper
             cq_[xxx] ==custom query; value passed as is
             examples: sw_Name=Bob ---> startswith(Name,'Bob')
             Name=Bob --> Name eq 'Bob'
             cl_Name=B ---> substringof(tolower(Name),tolower('B'))
             cq_S=Styles/any(d:d/id eq 5)  --> $filter=Styles/any(d:d/id eq 5)
             */
            var str = '';
            var checksum = 0;
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var prop;
                    var value = decodeURIComponent(query[key]);
                    if (key.indexOf('sw_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and startswith(" + prop + ",'" + value + "')" : "startswith(" + prop + ",'" + value + "')";
                        checksum++;
                    } else if (key.indexOf('swl_') === 0) {
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and startswith(tolower(" + prop + "),tolower('" + value + "'))" : "startswith(tolower(" + prop + "),tolower('" + value + "'))";
                        checksum++;
                    }else if(key.indexOf('swu_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and startswith(toupper(" + prop + "),toupper('" + value + "'))" : "startswith(toupper(" + prop + "),toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('c_') === 0) {
                        prop = key.substring(2);
                        str += (checksum > 0) ? " and contains(" + prop + ",'" + value + "')" : "contains(" + prop + ",'" + value + "')";
                        checksum++;
                    } else if (key.indexOf('cl_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and contains(tolower(" + prop + "),tolower('" + value + "'))" : "contains(tolower(" + prop + "),(tolower('" + value + "'))";
                        checksum++;
                    } else if(key.indexOf('cu_')===0){
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and contains(toupper(" + prop + "),toupper('" + value + "'))" : "contains(toupper(" + prop + "),(toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('ew_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and endswith(" + prop + ",'" + value + "')" : "endswith(" + prop + ",'" + value + "')";
                        checksum++;
                    }else if (key.indexOf('ewl_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and endswith(tolower(" + prop + "),tolower('" + value + "'))" : "endswith(tolower(" + prop + "),tolower('" + value + "'))";
                        checksum++;
                    }else if(key.indexOf('ewu_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and endswith(toupper(" + prop + "),toupper('" + value + "'))" : "endswith(toupper(" + prop + "),toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('eql_') === 0) {
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and tolower(" + key + ") eq tolower('" + value + "')" : "tolower(" + key + ") eq tolower('" + value + "')";
                        checksum++;
                    }else if(key.indexOf('equ_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and toupper(" + key + ") eq toupper('" + value + "')" : "toupper(" + key + ") eq toupper('" + value + "')";
                        checksum++;
                    } else if(key.indexOf('cq_') ===0){
                        str += (checksum > 0) ? " and " + value : value;
                        checksum++;
                    } else if(key.indexOf('search_')===0){
                        var prop=key.substring(7);
                        var props=prop.split("_");
                        var search='';
                        //search_Name_Id=bob
                        //Name=bob_Id=11
                        for(var i=0;i<props.length;i++){
                            var _prop=props[i];
                            if(i>0) search += " or ";
                            search += "contains(tolower(" + _prop + "),tolower('" + value + "'))";
                        }
                        str += (checksum > 0) ? " and " + search : search;
                        checksum++;   
                    } else if ((key.indexOf('$') !== 0) && key.toLowerCase()!=='page') {
                        str += (checksum > 0) ? " and " + key + " eq '" + value + "'" : key + " eq '" + value + "'";
                        checksum++;
                    }

                }
            }

            return str;
        }

    }, {});

    return $OData;


}));
