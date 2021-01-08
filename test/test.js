const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const {NODE_ENV} = process.env
const fakeDataGenerator = require('./fakeDataGenerator')

chai.use(chaiHttp);

const assert = chai.assert;
const requester = chai.request(app).keepOpen();

before(async () => {
  if(NODE_ENV !== 'test') {
    throw 'Not in the test env'
  }
  await fakeDataGenerator.clearTestDB()
  await fakeDataGenerator.createFakeData()
  return
})

after(async () => {
  requester.close()
})

module.exports = {
  assert,
  requester,
};