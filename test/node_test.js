var Flags = require('../flag');

module.exports = {
	setUp: function(callback){
		this.flag = new Flags(['cat', 'dog', 'bat']);
		callback();
	},

	instantiate: function(test){
		test.equal(this.flag.keys, 3, 'the flag object should have 3 keys');
		test.equal(this.flag.flags, 0, 'the flag object should not have any flags set');
		test.deepEqual(this.flag.flagHash, {cat: 1, dog: 2, bat: 4}, 'the flag hash should match a known object');
		test.done();
	},

	addKey: function(test){
		this.flag.newFlags('whale');
		test.deepEqual(this.flag.flagHash, {cat: 1, dog: 2, bat: 4, whale: 8}, 'the flag hash should match a known object');
		test.done();
	},

	addFlag: function(test){
		this.flag.add('dog');
		test.equal(this.flag.flags, 2, 'function can set a string flag');
		this.flag.add(['cat', 'bat']);
		test.equal(this.flag.flags, 7, 'function can set an array of flags');
		test.done();
	},

	noMultiAddFlag: function(test){
		this.flag.add('dog');
		this.flag.add('dog');
		test.equal(this.flag.flags, 2, 'a function cannot add a flag multiple times');
		test.done();
	},

	unsetFlag: function(test){
		this.flag.add(['cat', 'dog']);
		this.flag.remove('cat');
		test.equal(this.flag.flags, 2, 'function can unset a string flag');

		this.flag.add('cat', 'bat');
		this.flag.remove(['dog', 'bat']);
		test.equal(this.flag.flags, 1, 'function can unset an array of flags');
		test.done();
	},

	noMultiUnsetFlag: function(test){
		this.flag.add('cat');
		this.flag.remove('cat');
		this.flag.remove('cat');
		test.equal(this.flag.flags, 0, 'a flag cannot be unset multiple times');
		test.done();
	},

	createMask: function(test){
		var mask = this.flag._createMask(['cat', 'dog']);
		test.equal(mask, 3, 'a mask can be created with known flags');
		test.done();
	},

	hasAnyQuery: function(test){
		this.flag.add('cat');
		
		var arrT = this.flag.hasAny(['cat', 'dog']);
		var numT = this.flag.hasAny(7);
		var strT = this.flag.hasAny('cat');
		var arrF = this.flag.hasAny(['dog', 'bat']);
		var numF = this.flag.hasAny(6);
		var strF = this.flag.hasAny('dog');

		test.ok(arrT, 'flag can test if it has any items in an array');
		test.ok(numT, 'flag can test if it has any items in a given bitmask');
		test.ok(strT, 'flag can test if it has an individual flag from a string');
		test.ok(!arrF, 'flag will reject if it does not have any items in an array');
		test.ok(!numF, 'flag will reject if it does not have any items in a given bitmask');
		test.ok(!strF, 'flag will reject if a string flag key is not set');
		test.done();
	},

	hasAllOfQuery: function(test){
		this.flag.add(['cat', 'dog']);

		var arrT = this.flag.hasAllOf(['cat', 'dog']);
		var numT = this.flag.hasAllOf(3);
		var strT = this.flag.hasAllOf('dog');
		var arrF = this.flag.hasAllOf(['dog', 'bat']);
		var numF = this.flag.hasAllOf(6);
		var strF = this.flag.hasAllOf('bat');

		test.ok(arrT, 'flag can test if it has all items in array');
		test.ok(numT, 'flag can test if it has all items in a bitmask');
		test.ok(strT, 'flag can test if it has an indiviual flag from a string');
		test.ok(!arrF, 'flag will reject if it does not contain all of the items in an array');
		test.ok(!numF, 'flag will reject if it does not contain all of the items in a bitmask');
		test.ok(!strF, 'flag will reject if a string flag key is not set');
		test.done();
	},

	allQuery: function(test){
		test.ok(!this.flag.all(), 'query will return false if no flags are set');
		this.flag.add(['cat', 'bat']);
		test.ok(!this.flag.all(), 'query will return false if only some flags are set');
		this.flag.add('dog');
		test.ok(this.flag.all(), 'query will return true if all flags are set');
		test.done();
	},

	notAnyQuery: function(test){
		this.flag.add('cat')

		var arrT = this.flag.notAny(['bat', 'dog']);
		var numT = this.flag.notAny(6);
		var strT = this.flag.notAny('dog');
		var arrF = this.flag.notAny(['cat', 'bat']);
		var numF = this.flag.notAny(7);
		var strF = this.flag.notAny('cat');

		test.ok(arrT, '');
		test.ok(numT, '');
		test.ok(strT, '');
		test.ok(!arrF, '');
		test.ok(!numF, '');
		test.ok(!strF, '');
		test.done();
	},

	notAllOfQuery: function(test){
		this.flag.add(['cat', 'dog']);

		var arrT = this.flag.notAllOf(['bat', 'dog']);
		var numT = this.flag.notAllOf(6);
		var strT = this.flag.notAllOf('bat');
		var arrF = this.flag.notAllOf(['cat', 'dog']);
		var numF = this.flag.notAllOf(3);
		var strF = this.flag.notAllOf('cat');

		test.ok(arrT, '');
		test.ok(numT, '');
		test.ok(strT, '');
		test.ok(!arrF, '');
		test.ok(!numF, '');
		test.ok(!strF, '');
		test.done();
	},

	noneQuery: function(test){
		test.ok(this.flag.none(), 'query will return true if no flags have been set');
		this.flag.add('cat');
		test.ok(!this.flag.none(), 'query will return false if any flags have been set');
		test.done();
	},

	parseReturn: function(test){
		this.flag.add(['dog', 'cat']);
		test.deepEqual(this.flag.parseFlags(), ['cat', 'dog'], 'parseflag should return an array of set flags');
		test.done();
	},

	objectReturn: function(test){
		test.deepEqual(this.flag.objectify(), {cat: false, dog: false, bat: false}, 'objectify should return an object with all set keys set to false');
		this.flag.add(['cat', 'bat']);
		test.deepEqual(this.flag.objectify(), {cat: true, dog: false, bat: true}, 'objectify shoul update to represent the current state');
		test.done();
	},

	flagReset: function(test){
		this.flag.add(['cat', 'dog']);
		this.flag.reset(6);
		test.equal(this.flag.flags, 6, 'flags can be reset using a bitmask');

		this.flag.reset('cat');
		test.equal(this.flag.flags, 1, 'flags can be reset using a string');

		this.flag.reset(['dog', 'bat']);
		test.equal(this.flag.flags, 6, 'flags can be reset using an array');
		test.done();
	},

	flagUnregister: function(test){
		this.flag.add(['cat', 'dog']);
		this.flag.unregister();

		test.equal(this.flag.keys, 0, 'no keys should be set');
		test.equal(this.flag.flags, 0, 'no flags should be set');
		test.deepEqual(this.flag.flagHash, {}, 'flaghash shoul be an empty object');
		test.done();
	},

	flagMaxLoad: function(test){
		var oversizedList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af'];
		this.flag.unregister();
		try{
			this.flag.newFlags(oversizedList);
		} catch(err) {
			test.ok(false, 'throws an error when attempting to create more than 32 flags');
		}

		test.ok(true, 'a flag instance allows 32 flags to be set');
		test.done();
	},

	flagOverLoad: function(test){
		var oversizedList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag'];
		this.flag.unregister();
		try{
			this.flag.newFlags(oversizedList);
		} catch(err) {
			test.ok(true, 'throws an error when attempting to create more than 32 flags');
			test.done();
		}
	}
};



