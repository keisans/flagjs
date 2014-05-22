/**
 * @class Flags
 * @constructor
 * @param {Array} newFlags Optional array of flag keys to define when the flags module is instantiated
 */
var Flags = function( newFlags ){
    this.flags = 0;
    this.flagHash = {};
    this.keys = 0;
    if(newFlags){
        this.newFlags(newFlags);
    }
};

Flags.prototype = (function(){
    /*jshint curly:false */
    /**
     * An object representing the public attributes and methods of the flags object
     * 
     * @type {Object}
     */
    var _public = {};

    /**
     * A function for registering a single flag
     * 
     * @param  {String} name The name of the flag to be created
     */
    var createFlag = function( name ){
        if(this.flagHash[name]) return this.flagHash[name];
        
        this.flagHash[name] = Math.pow(2, this.keys);
        this.keys += 1;
    };

    /**
     * Adds a single flag to the user object
     * 
     * @param {String} name The name of the flag to add to the user
     */
    var addFlag = function( name ){
        if( !this.flagHash[name] ) throw name + "is not a valid flag. Make sure you created it with the newFlag function";

        if(this.flags & this.flagHash[name]) return;

        this.flags += this.flagHash[name];
    };

    /**
     * Removes a single flag from the user
     * 
     * @param  {String} name The name of the flag to be removed
     */
    var removeFlag = function( name ){
        if( !this.flagHash[name] ) throw name + "is not a valid flag. Make sure you created it with the newFlag function";

        if(!(this.flags & this.flagHash[name])) return;

        this.flags -= this.flagHash[name];
    };

    /**
     * Creates a mask based on an array of keys
     * 
     * @param  {Array}  flags An array of flag keys to be converted to a mask
     * @return {Number}       A number mask representing the specified flags
     */
    var createMask = function( flags ){
        var mask = 0;
        for(var f in flags){
            if (flags.hasOwnProperty(f)){
                if( !this.flagHash[flags[f]] ) throw flags[f] + " is not a valid flag. Make sure you created it with the newFlag function";

                mask += this.flagHash[flags[f]];
            }
        }

        return mask;
    };

    /**
     * Tests whether the user's flags match the input criteria
     * 
     * @param  {Number}  mask    A filter representing the keys to check the user's flags against
     * @param  {Boolean} all     Whether or not this function is checking against 'all' or 'any' of the keys
     * @param  {Boolean} inverse Whether to check if the user has the properties or does not have the properties
     * @return {Boolean}         Whether the user's flags match the input criteria
     */
    var flagTest = function( mask, all, inverse ){
        var flagMask = (typeof mask === "number") ? mask : (typeof mask === "string") ? this.flagHash[mask] : createMask.call(this, mask);
        var ret = false;

        if(all){
            ret = ((this.flags & flagMask) === flagMask) ? true : false;
        } else {
            ret = (this.flags & flagMask) ? true : false;
        }

        if (inverse){
            ret = !ret;
        }

        return ret;
    };

    /**
     * Creates new possible flags
     * 
     * @method newFlags
     * @param  {[String]} flags A string representing a possible flag
     * @param  {[Array]}  flags An array of strings representing possible flags
     * @return {Flags}          Returns self for chaining
     */
    _public.newFlags = function( flags ){
        if(typeof flags === 'string'){
            createFlag.call(this, flags);
        } else {
            for(var flag in flags){
                if (flags.hasOwnProperty(flag)){
                    createFlag.call(this, flags[flag]);
                }
            }
        }
        return this;
    };

    /**
     * Returns a mask with a given array of flags. Used primarily for debugging
     *
     * @example
     * Util.Flag.newFlags(['cat', 'dog', 'bat']);
     * Util.Flag._createMask(['cat, dog']); // 3
     * 
     * @method _createMask
     * @param  {Array}  flags An array of flag key strings
     * @return {Number}       An integer representing the mask created my those options
     */
    _public._createMask = function( flags ){
        return createMask.call(this, flags);
    };

    /**
     * Checks to see if the user has any of the described flags
     * 
     * @method hasAny
     * @param  {[String]} mask A string representing a flag to check
     * @param  {[Number]} mask A number mask
     * @param  {[Array]}  mask An array of flag key strings to be checked
     * @return {Boolean}       A boolean representing whether the user has any of the specified flags
     */
    _public.hasAny = function( mask ){
        return flagTest.call(this, mask, false, false);
    };

    /**
     * Checks to see if the user has all of the specified flags
     * 
     * @method hasAllOf
     * @param  {[String]} mask A string representing a flag to check
     * @param  {[Number]} mask A number mask
     * @param  {[Array]}  mask An array of flag key strings to be checked
     * @return {Boolean}       A boolean representing whether the user has any of the specified flags
     */
    _public.hasAllOf = function( mask ){
        return flagTest.call(this, mask, true, false);
    };

    /**
     * Checks to see if the user has all of the flags that have been defined
     *
     * @method all
     * @return {Boolean} A boolean representing whether the user has all the defined flags
     */
    _public.all = function(){
        var flagTotal = Math.pow(2, this.keys) - 1;
        if(this.flags === flagTotal){
            return true;
        }
        return false;
    };

    /**
     * Checks to see if the user does not have any of the specified flags
     * This method will return `true` if the user *does not* have **any** of the specified flags
     * 
     * @method notAny
     * @param  {[String]} mask A string representing a flag to check
     * @param  {[Number]} mask A number mask
     * @param  {[Array]}  mask An array of flag key strings to be checked
     * @return {Boolean}       A boolean representing whether the user has any of the specified flags
     */
    _public.notAny = function( mask ){
        return flagTest.call(this, mask, false, true);
    };

    /**
     * Checks to see if the user does not have all of a set of specified flags
     * This method will only return `true` if the user *does not* have **all** of the specified flags
     * 
     * @method notAllOf
     * @param  {[String]} mask A string representing a flag to check
     * @param  {[Number]} mask A number mask
     * @param  {[Array]}  mask An array of flag key strings to be checked
     * @return {Boolean}       A boolean representing whether the user has any of the specified flags
     */
    _public.notAllOf = function( mask ){
        return flagTest.call(this, mask, true, true);
    };

    /**
     * Checks to see if the user has *any* flags defined
     * This method will return true only if the user has **no** flags set
     *
     * @method none
     * @return {Boolean} A boolean representing whether the user has no set flags
     */
    _public.none = function(){
        if(this.flags === 0){
            return true;
        }
        return false;
    };

    /**
     * Converts the user's flags back into their keys. Returns an array of flags that
     * have been set on the user
     * 
     * @method parseFlags
     * @return {Array} An array of flags set on the user
     */
    _public.parseFlags = function(){
        var aFromFlags = [];
        for(var key in this.flagHash){
            if (this.flagHash.hasOwnProperty(key)){
                if(this.flags & this.flagHash[key]){
                    aFromFlags.push(key);
                }
            }
        }
        return aFromFlags;
    };


    /**
     * Sets a flag as true on the user
     *
     * @todo   merge this and the remove method for a mor DRY implementation
     * @method add
     * @param  {[String]} flags A flag key string to be set on the user
     * @param  {[Array]}  flags An array of flag key strings to be set on the user
     * @return {Flags}          Self reference for chaining
     */
    _public.add = function(flags) {
        if (typeof flags === 'string') {
            addFlag.call(this, flags);
        } else {
            for (var flag in flags) {
                if (flags.hasOwnProperty(flag)) {
                    addFlag.call(this, flags[flag]);
                }
            }
        }

        return this;
    };

    /**
     * Sets a flag as false on the user
     *
     * @method remove
     * @param  {[String]} flags A flag key string to be set on the user
     * @param  {[Array]}  flags An array of flag key strings to be set on the user
     * @return {Flags}          Self reference for chaining
     */
    _public.remove = function(flags) {
        if (typeof flags === 'string') {
            removeFlag.call(this, flags);
        } else {
            for (var flag in flags) {
                if (flags.hasOwnProperty(flag)) {
                    removeFlag.call(this, flags[flag]);
                }
            }
        }

        return this;
    };
    
    /**
     * Resets the flags currently set to the specified mask
     *
     * @method reset
     * @param  {Number} flags A mask representing the flags to reset the state to
     * @param  {String} flags Resets the currently set flags, delegates to the add function
     * @param  {Array}  flags Resets the currently set flags, delegates to the add function
     * @return {Flags}        Returns self for chaning;
     */
    _public.reset = function(flags){
        var flagTotal = Math.pow(2, this.keys) - 1;

        if(typeof flags !== 'number'){
            this.flags = 0;
            return this.add(flags);
        }

        if(flags <= flagTotal){
            this.flags = flags;
        } else {
            throw flags + ' is not a valid flag mask. Please make sure all your flags are defined';
        }

        return this;
    };

    _public.unregister = function(){
        this.keys = 0;
        this.flagHash = {};
        this.flags = 0;
    };

    return _public;
}());

if(typeof define === 'function' && define.amd){
    define('flags', [], Flags);
} else if (typeof exports !== 'undefined'){
    
}