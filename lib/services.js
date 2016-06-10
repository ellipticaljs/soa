
/*
 * =============================================================
 * elliptical.Store
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Store=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Store;
    }
}(this, function (Class) {

    var Store;
    Store=Class.extend({
        '@resource':'Store',
        $provider:null,

        /**
         *
         * @param {string} key
         * @returns {*}
         * @public
         */
        get:function(key){
            return this.$provider.get(key);
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set:function(key,value,params){
            return this.$provider.set(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return this.$provider.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete:function(key){
            return this.$provider.delete(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return this.$provider.count();
        },

        /**
         *
         * @public
         */
        clear:function(){
            return this.$provider.clear();
        }
    },{
        /**
         * Constructor
         * @constructs
         * @param {string} name
         * @param {object} provider
         */
        init:function(name,provider){
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }
        },

        /**
         *
         * @param {string} key
         * @returns {*}
         * @public
         */
        get:function(key){
            return this.constructor.get(key);
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set:function(key,value,params){
            return this.constructor.set(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return this.constructor.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete:function(key){
            return this.constructor.delete(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return this.constructor.count();
        },

        /**
         *
         * @public
         */
        clear:function(){
            return this.constructor.clear();
        }
    });

    return Store;

}));

/*
 * =============================================================
 * elliptical.Validation
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./service'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./service'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.Validation=factory(root.elliptical.Service);
        root.returnExports = root.elliptical.Validation;
    }
}(this, function (Service) {


    var Validation=Class.extend({
        '@resource':'Validation', //{String},
        $provider:null,

        /**
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        post: function (data, name, callback) {
            this.$provider.post(data,name,callback);
        },


        /**
         *
         * @param {object} data
         * @returns {*}
         * @public
         */
        onSuccess:function(data){
            return this.$provider.onSuccess(data);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        onError:function(params){
            return this.$provider.onError(params);
        }



    }, {
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },

        /**
         *
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        post: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !this.$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.post(data, name, callback);
        },

        /**
         *
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        put: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.put(data, name, callback);
        },

        /**
         *
         * @param {object} data
         * @returns {*}
         * @public
         */
        onSuccess: function (data) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onSuccess(data);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        onError: function (params) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onError(params);
        }

    });

    return Validation;



}));


/*
 * =============================================================
 * elliptical.Search
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Search=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Search;
    }
}(this, function (Class) {

    var Search;
    Search=Class.extend({
        '@resource':'Search',
        $provider:null,

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        find:function(params){
            return this.$provider.find(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },


        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        find:function(params){
            return this.constructor.find(params);
        }


    });

    return Search;

}));


/*
 * =============================================================
 * elliptical.Sort
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.Sort=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Sort;
    }
}(this, function (Class) {

    var Sort;
    Sort=Class.extend({
        '@resource':'Sort',
        $provider:null,

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sort:function(params){
            return this.$provider.sort(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sorted:function(params){
            return this.$provider.sorted(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        refresh:function(params){
            return this.$provider.refresh(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },


        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sort:function(params){
            return this.constructor.sort(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sorted:function(params){
            return this.constructor.sorted(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        refresh:function(params){
            return this.constructor.refresh(params);
        }


    });

    return Sort;

}));