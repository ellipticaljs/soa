/*
 * =============================================================
 * elliptical.$Pagination
 * =============================================================
 * returns a pagination ui context(object) for template binding
 *
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
        root.elliptical.$Pagination = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$Pagination;
    }
}(this, function (Provider) {
    /**
     * @param paginate {Object}
     * @param pagination {Object}
     * @param data {Object}
     * @returns {Object}
     */


    var $Pagination;
    $Pagination = Provider.extend({
        count: 'count',
        data: 'data',
        spread: 10,
        pageQueryString:false,

        /**
         *
         * @param {object} params
         * @param {object} data
         * @returns {{pagination, data}|*}
         * @public
         */
        get: function (params, data) {

            var count_ = this.count;
            var data_ = this.data;
            var spread_ = this.spread;

            if (params.paginate) params = params.paginate;

            return _pagination(params, data,this.pageQueryString);

            /**
             *
             * @param {object} params
             * @param {object} result
             * @param {boolean} useQueryString
             * @returns {object}
             * @qpi private
             */
            function _pagination(params, result,useQueryString) {
                var baseUrl, rawUrl, page, count, pageSize, pageSpread, data;
                baseUrl = params.baseUrl;
                rawUrl = params.rawUrl;
                page = params.page;


                if (result instanceof Array) {
                    count = result.length;
                    data = result;

                } else {
                    count = result[count_];
                    data = result[data_];
                    if (count === undefined) count = result.count;
                    if (data === undefined) data = result.data;
                }


                pageSize = params.pageSize;
                pageSpread = spread_;
                try {
                    page = parseInt(page);
                } catch (ex) {
                    page = 1;
                }

                var pageCount = parseInt(count / pageSize);
                var remainder = count % pageSize;
                if (pageCount < 1) pageCount = 1;
                else if (remainder > 0) pageCount++;

                //query search part of url
                var querySearch = getQuerySearch(rawUrl);

                //pagination object
                var pagination = {
                    page: page,
                    pageCount: pageCount,
                    prevPage: assignUrl(baseUrl,1,querySearch,rawUrl,useQueryString),
                    firstPage: null,
                    prevClass: 'hide',
                    nextPage: assignUrl(baseUrl,pageCount,querySearch,rawUrl,useQueryString),
                    nextClass: 'hide',
                    lastPage: null,
                    pages: [],
                    beginRecord: null,
                    endRecord: null,
                    count: count,
                    nextPageNo:null,
                    prevPageNo:null

                };
                //assign pagination properties
                //prev
                if (page > 1) {
                    pagination.prevClass = '';
                    pagination.prevPage = assignUrl(baseUrl, parseInt(page - 1), querySearch,rawUrl,useQueryString);
                    pagination.prevPageNo=page-1;
                }
                //next
                if (page < pageCount) {
                    pagination.nextClass = '';
                    pagination.nextPage = assignUrl(baseUrl, parseInt(page + 1), querySearch,rawUrl,useQueryString);
                    pagination.nextPageNo=page + 1;
                }

                //get page links

                pagination.pages = _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch,rawUrl,useQueryString);


                //first,last pages
                pagination.firstPage = assignUrl(baseUrl, 1, querySearch,rawUrl,useQueryString);
                pagination.lastPage = assignUrl(baseUrl, pageCount, querySearch,rawUrl,useQueryString);
                if (page === pageCount) pagination.nextPage = pagination.lastPage;

                //assign record pointers
                var currentPointer = assignRecordPointers(count, page, pageSize);
                pagination.beginRecord = currentPointer.beginRecord;
                pagination.endRecord = currentPointer.endRecord;

                return {
                    pagination: pagination,
                    data: data
                };

            }


            /**
             *
             * @param {string} baseUrl
             * @param {number} page
             * @param {number} pageCount
             * @param {number} pageSpread
             * @param {string} querySearch
             * @param {string} rawUrl
             * @param {boolean} useQueryString
             * @returns {Array}
             * @api private
             */
            function _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch,rawUrl,useQueryString) {
                var pages = [];
                if (pageSpread > pageCount) {
                    pageSpread = pageCount;
                }

                if (page < pageSpread) {

                    for (var i = 0; i < pageSpread; i++) {
                        var obj = {
                            page: i + 1,
                            pageUrl: assignUrl(baseUrl, parseInt(i + 1), querySearch,rawUrl,useQueryString)
                        };

                        if (i === parseInt(page - 1)) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                } else {
                    var halfSpread = parseInt(pageSpread / 2);
                    var beginPage, endPage;
                    if (pageCount < page + halfSpread) {
                        endPage = pageCount;
                        beginPage = endPage - pageSpread;
                    } else {
                        endPage = page + halfSpread;
                        beginPage = page - halfSpread;
                    }
                    if(beginPage===0) beginPage=1;
                    for (var i = beginPage; i < endPage + 1; i++) {
                        var obj = {
                            page: i,
                            pageUrl: assignUrl(baseUrl, i, querySearch,rawUrl,useQueryString)
                        };
                        if (i === page) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                }
            }

            /**
             *
             * @param {string} baseUrl
             * @param {number} index
             * @param {string} querySearch
             * @param {string} rawUrl
             * @param {boolean} useQueryString
             * @returns {string}
             * @api private
             */
            function assignUrl(baseUrl, index, querySearch,rawUrl,useQueryString) {
                var pageUrl;
                if(useQueryString){
                    pageUrl=baseUrl + setQuery('page',index,querySearch,rawUrl);
                }else{
                    pageUrl = baseUrl + '/' + index;
                    if (querySearch && querySearch !== undefined) pageUrl += querySearch;
                }
                
                return pageUrl;
            }

            /**
             *
             * @param {number} count
             * @param {number} page
             * @param {number} pageSize
             * @returns {object}
             * @api private
             */
            function assignRecordPointers(count, page, pageSize) {
                var beginRecord = (page - 1) * pageSize + 1;
                if (count === 0) beginRecord = 0;
                var endRecord = page * pageSize;
                if (endRecord > count) endRecord = count;
                return {
                    beginRecord: beginRecord,
                    endRecord: endRecord
                };
            }

             /**
             *
             * @param {string} url
             * @returns {string}
             * @api private
             */
            function getQuerySearch(url) {
                if(!url) return null;
                var index = url.indexOf('?');
                var length = url.length;
                if (index > -1) return url.substring(index, length);
                else return null;
            }
            
            /**
             *
             * @param {string} url
             * @param {string} ji
             * @returns {string}
             * @api private
             */
            function queryString(url, ji) {
               var hu = url.split('?')[1];
               if (typeof hu !== 'undefined') {
                  var gy = hu.split("&");
                  for (i = 0; i < gy.length; i++) {
                      var ft = gy[i].split("=");
                      if (ft[0] == ji) return ft[1];
                  }
               }
               
               return null;
            }
            
            /**
             *
             * @param {string} url
             * @param {string} val
             * @param {string} search
             * @param {string} u
             * @returns {string}
             * @api private
             */
            function setQuery(key,val,search,u){
               if (search && search!=='') {
                  var val_ = queryString(u, key);
                  if (!val_) search += '&' + key + '=' + encodeURIComponent(val);
                  else search=search.replace(key + '=' + val_, key + '=' + val);
               }else search = '?' + key + '=' + encodeURIComponent(val);
            
               return search;
            }
        }


    }, {});


    return $Pagination;

}));