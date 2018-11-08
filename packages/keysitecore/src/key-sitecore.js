/* eslint-disable no-shadow,prefer-destructuring,prefer-const,prettier/prettier */
const _createClass = (function() {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}());

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

const KeySitecore = (function() {
  function KeySitecore() {
    _classCallCheck(this, KeySitecore);
  }

  _createClass(
    KeySitecore,
    [
      {
        key: 'beforeMount',
        value: function beforeMount() {
          if (this.$el !== undefined) {
            this.domObj = {};
            const domObj = this.$el.getElementsByTagName('*');
            let key = this.$el.getAttribute('key');

            /* istanbul ignore else */
            if (this.$el.id !== '' && key != null) {
              this.domObj[this.$el.id] = key;
            }

            for (let i = 0; i < domObj.length; i += 1) {
              const elem = domObj[i];
              key = elem.getAttribute('key');

              /* istanbul ignore else */
              if (elem.id !== '' && key != null) {
                /* istanbul ignore else */
                if (this.domObj[elem.id] === undefined) {
                  this.domObj[elem.id] = key;
                } else {
                  throw new RangeError(`The id ${elem.id} is already set`);
                }
              }
            }
          }
        }
      },
      {
        key: 'mounted',
        value: function mounted() {
          /* istanbul ignore else */
          if (this.domObj) {
            let key = this.domObj[this.$el.id];

            /* istanbul ignore else */
            if (key) {
              this.$el.setAttribute('key', key);
            }

            const domObj = this.$el.getElementsByTagName('*');
            const max = domObj.length;

            for (let i = 0; i < max; i += 1) {
              const elem = domObj[i];
              key = this.domObj[elem.id];

              /* istanbul ignore else */
              if (key) {
                elem.setAttribute('key', key);
              }
            }

            this.domObj = {};
          }
        }
      }
    ],
    [
      {
        key: 'install',
        value: function install(Vue) {
          let _ref = new KeySitecore(),
            beforeMount = _ref.beforeMount,
            mounted = _ref.mounted;

          Vue.mixin({
            beforeMount,
            mounted
          });
        }
      }
    ]
  );

  return KeySitecore;
}());

module.exports = KeySitecore;
