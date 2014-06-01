module('Flags', {
	setup: function(){
		flag = new Flags(['cat', 'dog', 'bat']);
	}
});

test('when created, the flag variable should have 3 flags set and none active', function(){
	equal(flag.keys, 3, 'the flag object should have 3 keys');
	equal(flag.flags, 0, 'the flag object should not have any flags set');
	deepEqual(flag.flagHash, {cat: 1, dog: 2, bat: 4}, 'the flag hash should match a known object');
});

test('the flag object should be able to add new keys', function(){
	flag.newFlags('whale');
	deepEqual(flag.flagHash, {cat: 1, dog: 2, bat: 4, whale: 8}, 'the flag hash should match a known object');
});

test('a function should be able to set flags to true', function(){
	flag.add('dog');
	equal(flag.flags, 2, 'function can set a string flag');
	flag.add(['cat', 'bat']);
	equal(flag.flags, 7, 'function can set an array of flags');
});

test('a single flag should not be addable multiple times', function(){
	flag.add('dog');
	flag.add('dog');
	equal(flag.flags, 2, 'a function cannot add a flag multiple times');
});

test('a flag instance should be able to unset a flag', function(){
	flag.add(['cat', 'dog']);
	flag.remove('cat');
	equal(flag.flags, 2, 'function can unset a string flag');

	flag.add('cat', 'bat');
	flag.remove(['dog', 'bat']);
	equal(flag.flags, 1, 'function can unset an array of flags');
});

test('a flag instance should not be able to unset a flag multiple times', function(){
	flag.add('cat');
	flag.remove('cat');
	flag.remove('cat');
	equal(flag.flags, 0, 'a flag cannot be unset multiple times');
});

test('a flag instance should be able to create an abstract bitmask with known flags', function(){
	var mask = flag._createMask(['cat', 'dog']);

	equal(mask, 3, 'a mask can be created with known flags');
});

test('a flag instance should be able to test if any flags in the params are set', function(){
	flag.add('cat');
	
	var arrT = flag.hasAny(['cat', 'dog']);
	var numT = flag.hasAny(7);
	var strT = flag.hasAny('cat');
	var arrF = flag.hasAny(['dog', 'bat']);
	var numF = flag.hasAny(6);
	var strF = flag.hasAny('dog');

	ok(arrT, 'flag can test if it has any items in an array');
	ok(numT, 'flag can test if it has any items in a given bitmask');
	ok(strT, 'flag can test if it has an individual flag from a string');
	ok(!arrF, 'flag will reject if it does not have any items in an array');
	ok(!numF, 'flag will reject if it does not have any items in a given bitmask');
	ok(!strF, 'flag will reject if a string flag key is not set');
});

test('a flag instance should be able to test if all the flags in the params are set', function(){
	flag.add(['cat', 'dog']);

	var arrT = flag.hasAllOf(['cat', 'dog']);
	var numT = flag.hasAllOf(3);
	var strT = flag.hasAllOf('dog');
	var arrF = flag.hasAllOf(['dog', 'bat']);
	var numF = flag.hasAllOf(6);
	var strF = flag.hasAllOf('bat');

	ok(arrT, 'flag can test if it has all items in array');
	ok(numT, 'flag can test if it has all items in a bitmask');
	ok(strT, 'flag can test if it has an indiviual flag from a string');
	ok(!arrF, 'flag will reject if it does not contain all of the items in an array');
	ok(!numF, 'flag will reject if it does not contain all of the items in a bitmask');
	ok(!strF, 'flag will reject if a string flag key is not set');
});

test('a flag instance should be able to test if all of its flags are set', function(){
	ok(!flag.all(), 'query will return false if no flags are set');
	flag.add(['cat', 'bat']);
	ok(!flag.all(), 'query will return false if only some flags are set');
	flag.add('dog');
	ok(flag.all(), 'query will return true if all flags are set');
});

test('a flag instance should be able to query if none of the params are set', function(){
	flag.add('cat')

	var arrT = flag.notAny(['bat', 'dog']);
	var numT = flag.notAny(6);
	var strT = flag.notAny('dog');
	var arrF = flag.notAny(['cat', 'bat']);
	var numF = flag.notAny(7);
	var strF = flag.notAny('cat');

	ok(arrT, '');
	ok(numT, '');
	ok(strT, '');
	ok(!arrF, '');
	ok(!numF, '');
	ok(!strF, '');
});

test('a flag instance should be able to query if all of the given params are unset', function(){
	flag.add(['cat', 'dog']);

	var arrT = flag.notAllOf(['bat', 'dog']);
	var numT = flag.notAllOf(6);
	var strT = flag.notAllOf('bat');
	var arrF = flag.notAllOf(['cat', 'dog']);
	var numF = flag.notAllOf(3);
	var strF = flag.notAllOf('cat');

	ok(arrT, '');
	ok(numT, '');
	ok(strT, '');
	ok(!arrF, '');
	ok(!numF, '');
	ok(!strF, '');
});

test('a flag instance should be able to query if none of its flags have been set', function(){
	ok(flag.none(), 'query will return true if no flags have been set');
	flag.add('cat');
	ok(!flag.none(), 'query will return false if any flags have been set');
});

test('a flag instance should be able to return an array of set flags', function(){
	flag.add(['dog', 'cat']);
	deepEqual(flag.parseFlags(), ['cat', 'dog'], 'parseflag should return an array of set flags');
});

test('a flag instance shoul be able to return an object representing its current state', function(){
	deepEqual(flag.toJSON(), {cat: false, dog: false, bat: false}, 'toJSON should return an object with all set keys set to false');
	flag.add(['cat', 'bat']);
	deepEqual(flag.toJSON(), {cat: true, dog: false, bat: true}, 'toJSON shoul update to represent the current state');
	equal(JSON.stringify(flag), "{\"cat\":true,\"dog\":false,\"bat\":true}", 'flag object should respond to JSON.stringify correctly');
})

test('a flag instance should able to reset to a given state', function(){
	flag.add(['cat', 'dog']);
	flag.reset(6);
	equal(flag.flags, 6, 'flags can be reset using a bitmask');

	flag.reset('cat');
	equal(flag.flags, 1, 'flags can be reset using a string');

	flag.reset(['dog', 'bat']);
	equal(flag.flags, 6, 'flags can be reset using an array');

});

test('a flag instance should be able to unregister itself', function(){
	flag.add(['cat', 'dog']);
	flag.unregister();

	equal(flag.keys, 0, 'no keys should be set');
	equal(flag.flags, 0, 'no flags should be set');
	deepEqual(flag.flagHash, {}, 'flaghash shoul be an empty object');
});

test('a flag instance should be able to register up to 32 flags', function(){
	expect(1);
	var oversizedList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af'];
	flag.unregister();
	try{
		flag.newFlags(oversizedList);
	} catch(err) {
		ok(false, 'throws an error when attempting to create more than 32 flags');
	}

	ok(true, 'a flag instance allows 32 flags to be set');
});

test('a flag instance should not be able to register more than 32 flags', function(){
	var oversizedList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag'];
	flag.unregister();
	try{
		flag.newFlags(oversizedList);
	} catch(err) {
		ok(true, 'throws an error when attempting to create more than 32 flags');
	}
});



