from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
from flask_login import login_user, LoginManager
from .actions import books as b
from .actions import vocab as v
from .actions import user as u
from connections import connections as c
import json

api = Flask(__name__)
api.secret_key = c.FLASK_SECRET_KEY
login_manager = LoginManager()
login_manager.init_app(api)
CORS(api)
base_route = r'/books/api/v1/'

books_adapter = b.BooksAPI()
vocab_adapter = v.VocabAPI()

#books
@api.route(base_route+"books/", methods=["GET", "POST"])
def books_endpoint():
    args = request.args
    if request.method == "GET":
        payload = books_adapter.select(args) 
        return json.dumps(payload, indent=2, sort_keys=True, default=str)

#vocab
@api.route(base_route+"vocab/", methods=["GET"])
def vocab_methods():
    args = request.args
    if request.method == "GET":
        payload = vocab_adapter.select(args)
        return json.dumps(payload, indent=2, sort_keys=True, default=str)
    else:
        print(args.get("action"))

@api.route(base_route + "login/", methods=["POST", "GET"])
@cross_origin()
def login():
    @login_manager.request_loader
    def load_user(request):
        return u.User(username=request.json['username'], password=request.json['password'])

    user = load_user(request)
    if user.auth_user():
        login_user(user, remember=True)
        userAuth = [{ 'auth': user.get_auth_token() }]
    else:
        userAuth = [{ 'auth': False }]
    return json.dumps(userAuth)
if __name__ == "__main__":
    api.run(debug=True)




