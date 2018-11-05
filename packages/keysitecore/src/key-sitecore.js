class KeySitecore {
  beforeMount() {
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

  mounted() {
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

  static install(Vue) {
    const { beforeMount, mounted } = new KeySitecore();

    Vue.mixin({
      beforeMount,
      mounted
    });
  }
}

module.exports = KeySitecore;
