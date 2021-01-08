const signDB = require('../server/db/signDB')
const { assert } = require('./test')

describe('unit Test server/db/checkUserExistence', () => {
  it('Get Nick Information', async () => {
    const result = await signDB.checkUserExistence('nicknick@yahoo.com.tw')
    const expectResult = {
      id: 1,
      name: 'Nick',
      email: 'nicknick@yahoo.com.tw',
      password: 'nicknick',
      login: 'native',
      image: null
    }
    assert.deepEqual(result[0], expectResult);
  })
  it('Create new User', async () => {
    const dataInput = ['testName', 'testMail', 'testPWD', 'facebook']
    const result = await signDB.createUser(dataInput)
    const expectResult = {
      stat: "ok"
    }
    assert.deepEqual(result, expectResult);
  })
})


