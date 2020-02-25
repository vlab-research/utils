const should = require('chai').should()
const u = require('./utils')

describe('recursiveJSONParser', () => {
  it('works super duper well', () => {
    u.recursiveJSONParser({}).should.deep.equal({})

    u.recursiveJSONParser({ foo: '123'}).should.deep.equal({ foo: '123'})

    u.recursiveJSONParser({ foo: 'bar'}).should.deep.equal({ foo: 'bar'})

    u.recursiveJSONParser({ foo: null}).should.deep.equal({ foo: null})

    u.recursiveJSONParser({ foo: '{ "foo": "bar"}'})
      .should.deep.equal({ foo: { foo: 'bar' }})

    u.recursiveJSONParser([{ foo: '{ "foo": "bar"}'}, null])
      .should.deep.equal([{ foo: { foo: 'bar' }}, null])

    u.recursiveJSONParser(JSON.stringify([JSON.stringify({ foo: JSON.stringify({ foo: 'bar'})}), null]))
      .should.deep.equal([{ foo: { foo: 'bar' }}, null])
  })
})
