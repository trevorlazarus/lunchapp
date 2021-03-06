var assert = require("assert");
var models = require('../models');
var Group = models.Group;

describe('Group', function() {
  var aGroup;
  before(function(done) {
      models.init('mongodb://localhost','unittest');
      aGroup = Group.createGroup(
          'administrator',
          {
              'name':'A',
              'members':[{'id':'testid','name':'Mr. A'}],
              'shops':[
                  {'id': 'shop'}
                  ],
          },
          function (err, group) {
              aGroup = group;
              done();
          }
      );
  });
  describe('#findByMemberId()', function() {
    it('find by member id test1', function(done) {
        Group.findByMemberId('testid', function(err, groups) {
            if (err) done(err);
            assert.equal(groups[0].name, 'A');
            done();
        });
    });
  });
  describe('#findOneByGroupId()', function() {
    it('find one by group id', function(done) {
        Group.findOneByGroupId("testid", aGroup._id, function(err, group) {
            if (err) done(err);
            assert.equal(group.name, 'A');
            done();
        });
    });
  });
  describe('#updateGroup()', function() {
    it('updateGroup', function(done) {
        aGroup.decidedShop = 'shop';
        aGroup.save(done());
        // need to create document
        // Group.updateGroup(groupJson, function(err) {
        //     if (err) done(err);
        //
        //     Group.findOneByGroupId("testid", aGroup._id, function(err, group) {
        //         if (err) done(err);
        //         assert.equal(group.decidedShop, 'shop');
        //         done();
        //     });
        //
        // });
    });
  });
  describe('#vote()', function() {
    it('vote test', function(done) {
        Group.vote('testid', aGroup._id, 'shop', function(err) {
            if (err) done(err);
            Group.findOneByGroupId('testid', aGroup._id, function(err, group) {
                if (err) done(err);
                assert.equal(group.shops[0].votedBy[0], 'testid');
                done();
            });
        });
    });
  });
  describe('#visited()', function() {
    it('visited test', function(done) {
        assert.equal(!aGroup.decidedShop, false);
        Group.changeStateIfRequired(aGroup, 'vote',
        function () {
            return 'decidedShop'
        },
        function(err, group) {
            if (err) done(err);
            Group.findOneByGroupId('testid', aGroup._id, function(err, group) {
                if (err) done(err);
                assert.equal(group.shops[0].visitedCount, 1);
                done();
            });
        });
    });
  });
  describe('#setDecidedShop()', function() {
    it('visited test', function(done) {
        Group.changeStateIfRequired(aGroup, 'voted',
        function () {
            return 'decidedShop'
        },
        function(err, group) {
            if (err) done(err);
            Group.findOneByGroupId('testid', aGroup._id, function(err, group) {
                if (err) done(err);
                assert.equal(group.decidedShop, 'decidedShop');
                done();
            });
        });
    });
  });
  describe('#unvote()', function() {
    it('unvote test', function(done) {
        Group.unvote('testid', aGroup._id, 'shop', function(err) {
            if (err) done(err);
            Group.findOneByGroupId('testid', aGroup._id, function(err, group) {
                if (err) done(err);
                assert.equal(group.shops[0].votedBy.length, 0);
                done();
            });
        });
    });
  });
  describe('#remove()', function() {
    it('remove test', function(done) {
        Group.removeGroup('admin', aGroup._id, function(err) {
            if (err) done(err);
            done();
        });
    });
  });
  after(function(done) {
      Group.remove();
      models.destroy(done);
  });
});
