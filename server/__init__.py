from quart import Quart

app = Quart(__name__)

@app.route('/favicon.html')
async def favicon():
    return 'hello'

app.run(host='0.0.0.0', port=3001)
