const fs = require('fs')
const path = require('path')

// Load bug text files
const bugTexts = {
    xeontext1: require('../69/xeontext1').xeontext1,
    xeontext2: require('../69/xeontext2').xeontext2,
    xeontext3: require('../69/xeontext3').xeontext3,
    xeontext4: require('../69/xeontext4').xeontext4,
    xeontext5: require('../69/xeontext5').xeontext5,
    xeontext6: require('../69/xeontext6').xeontext6,
    xeontext7: require('../69/xeontext7').xeontext7,
    xeontext8: require('../69/xeontext8').xeontext8,
    xeontext9: require('../69/xeontext9').xeontext9,
    xeontext10: require('../69/xeontext10').xeontext10,
}

module.exports = {
    bugTexts
  }
