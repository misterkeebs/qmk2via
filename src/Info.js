class Info {
  constructor(raw) {
    this.data = JSON.parse(raw);
    this.layouts = this.data.layouts;
    this.layoutNames = Object.keys(this.layouts);
    this.mainLayout = this.layoutNames[0];
  }
}

module.exports = Info;
