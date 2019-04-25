from flask import Flask, send_from_directory, render_template
import filter
from flask import request

app = Flask(__name__, static_url_path='')


@app.route('/')
@app.route('/<name>')
def index(name=None):
    return render_template('index.html', name=name)

@app.route('/front.js')
def front():
    return app.send_static_file('front.js')


@app.route('/styles.css')
def styles():
    return app.send_static_file('styles.css')


#to run server - export FLASK_ENV=development
# run flask
## @app.route('/')
## def hello_world():
 ##   return 'Hello, World!'


@app.route('/malika')
def show_user_profile():
    # show the user profile for that user
    return 'malika'


@app.route('/weezer')
def run_weezer():
    url = 'https://rest.bandsintown.com/artists/weezer/events?app_id=d2f84baa059b6c4e9357a1726db9c11d&date=upcoming'
    return filter.filterData(url)


@app.route('/events/<artistName>')
def get_events(artistName):
    url = "https://rest.bandsintown.com/artists/" + str(artistName)
    newurl = url + "/events?app_id=d2f84baa059b6c4e9357a1726db9c11d&date=upcoming"
    return filter.filterData(newurl)

if __name__ == '__main__':
    print('appname')
    app.run(debug=True)