// Generated by CoffeeScript 1.9.3
(function() {
  var CoinHistory, User, func_coin, moment, weekCache;

  CoinHistory = __M('coin_history');

  User = __M('users');

  User.hasOne(CoinHistory, {
    foreignKey: "user_id"
  });

  CoinHistory.belongsTo(User, {
    foreignKey: "user_id"
  });

  CoinHistory.sync();

  moment = require('moment');

  weekCache = {};

  func_coin = {
    add: function(count, user_id, reason, callback) {
      return CoinHistory.findAll({
        where: {
          user_id: user_id,
          day: (new Date()).getTime() / 1000 / 60 / 60 / 24
        },
        raw: true
      }).success(function(his) {
        var total;
        if (his) {
          total = 0;
          his.forEach(function(h) {
            return total += h.step;
          });
          if (total > __C.day_coin_max) {
            return callback && callback(new Error('已经达到本日最高积分（' + __C.day_coin_max + '）'));
          } else {
            User.find({
              where: {
                id: user_id
              }
            }).success(function(u) {
              if (u) {
                return u.updateAttributes({
                  coin: u.coin * 1 + count
                });
              }
            });
            return CoinHistory.create({
              user_id: user_id,
              step: count,
              day: (new Date()).getTime() / 1000 / 60 / 60 / 24,
              reason: reason
            }).success(function(his) {
              return callback && callback(null, his);
            }).error(function(e) {
              return callback && callback(e);
            });
          }
        }
      }).error(function(e) {
        return callback && callback(e);
      });
    },
    getWeekTop: function(callback) {
      var data, dayofweek, nowWeek;
      nowWeek = moment().format("YYYY-ww");
      dayofweek = moment().format("d") * 1;
      data = {};
      if (weekCache[nowWeek]) {
        return callback(null, weekCache[nowWeek]);
      } else {
        return CoinHistory.findAll({
          where: {
            day: {
              gt: (new Date()).getTime() / 1000 / 60 / 60 / 24 - dayofweek,
              lt: 200000
            }
          },
          raw: true,
          include: [User]
        }).success(function(his) {
          his.forEach(function(h) {
            if (data[h.user_id]) {
              return data[h.user_id] += h.step;
            } else {
              return data[h.user_id] = h.step;
            }
          });
          console.log(data);
          weekCache[nowWeek] = data;
          return callback(null, data);
        }).error(function(e) {
          return callback(e);
        });
      }
    }
  };

  __FC(func_coin, CoinHistory, ['getAll', 'count']);

  module.exports = func_coin;

}).call(this);