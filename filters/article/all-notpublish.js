// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(req, res, next) {
    var condition;
    if (!res.locals.user) {
      next();
      return;
    }
    condition = {
      is_publish: 0,
      is_yuanchuang: 1,
      user_id: res.locals.user.id
    };
    return (__F('article/article')).getAll(1, 30, condition, function(error, articles) {
      if (error) {
        return next(error);
      } else {
        res.locals.nopublish_articles = articles;
        return next();
      }
    });
  };

}).call(this);
