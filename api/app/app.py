from flask import Flask, jsonify, request
from flask_cors import CORS
import actions.books as b
import actions.vocab as v
import json

api = Flask(__name__)
base_route = r'/api/v1/'
CORS(api)

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
    if request.method == "GET" and str(args.get("action")) == 'SELECT':
        payload = vocab_adapter.select(args)
        return json.dumps(payload, indent=2, sort_keys=True, default=str)
    if request.method == "GET" and str(args.get("action")) == 'VOCAB_OVER_TIME':
        payload = vocab_adapter.select_group_by_year_month(str(args.get("groupBy")))
        return json.dumps(payload, indent=2, sort_keys=True, default=str)
    if request.method == "GET" and str(args.get("action") == "GROUP_TYPE"):
        payload = vocab_adapter.select_word_type_by_group(str(args.get("groupBy")))
    else:
        print(args.get("action"))


if __name__ == "__main__":
    api.run(debug=True)




