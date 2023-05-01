import datetime
import hashlib
import json, db
import os
from datetime import datetime
from urllib.parse import urlparse
from uuid import uuid4 
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin

class Blockchain:
    def __init__(self):
        self.transaction = {}
        self.chain = []
        self.nodes = set()
        

        # Create the genesis block
        self.new_block(previous_hash='1', proof=100)

    def register_node(self, address):
        """
        Add a new node to the list of nodes

        :param address: Address of node. Eg. 'http://192.168.0.5:5000'
        """

        parsed_url = urlparse(address)
        if parsed_url.netloc:
            self.nodes.add(parsed_url.netloc)
        elif parsed_url.path:
            # Accepts an URL without scheme like '192.168.0.5:5000'.
            self.nodes.add(parsed_url.path)
        else:
            raise ValueError('Invalid URL')


    def valid_chain(self, chain):
        """
        Determine if a given blockchain is valid

        :param chain: A blockchain
        :return: True if valid, False if not
        """

        last_block = chain[0]
        current_index = 1

        while current_index < len(chain):
            block = chain[current_index]
            print(f'{last_block}')
            print(f'{block}')
            print("\n-----------\n")
            # Check that the hash of the block is correct
            last_block_hash = self.hash(last_block)
            if block['previous_hash'] != last_block_hash:
                return False

            # Check that the Proof of Work is correct
            if not self.valid_proof(last_block['proof'], block['proof'], last_block_hash):
                return False

            last_block = block
            current_index += 1

        return True
    

    def resolve_conflicts(self):
        """
        This is our consensus algorithm, it resolves conflicts
        by replacing our chain with the longest one in the network.

        :return: True if our chain was replaced, False if not
        """

        neighbours = self.nodes
        new_chain = None

        # We're only looking for chains longer than ours
        max_length = len(self.chain)

        # Grab and verify the chains from all the nodes in our network
        for node in neighbours:
            response = requests.get(f'http://{node}/block_chain')

            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                print(f"{node} - {chain}")

                # Check if the length is longer and the chain is valid
                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain

        # Replace our chain if we discovered a new, valid chain longer than ours
        if new_chain:
            self.chain = new_chain
            return True

        return False

    def new_block(self, proof, previous_hash):
        """
        Create a new Block in the Blockchain

        :param proof: The proof given by the Proof of Work algorithm
        :param previous_hash: Hash of previous Block
        :return: New Block
        """

        block = {
            'index': len(self.chain) + 1,
            'timestamp': datetime.now().__str__(),
            'transaction': self.transaction,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        self.chain.append(block)

        if len(self.chain) > 1:
            #----------------------Smart Contract-------------------------------
            id = block['transaction']['id']
            totalCoins = 0
            for block in self.chain:
                if block['index'] != 1:
                    if block['transaction']['id'] == id:
                        totalCoins += block['transaction']['coins']


            if totalCoins >= 10000:
                blockchain.new_transaction(id, "Cash back", -10000, "Smart contract", "Rewarded R100 for 10 000 coins")
            #----------------------Smart Contract-------------------------------

        #Reset the transaction
        self.transaction= {}
        return block

    def new_transaction(self, id, category, coins, by, message):
        """
        Creates a new transaction to go into the next mined Block

        :param sender: Address of the Sender
        :param recipient: Address of the Recipient
        :param amount: Amount
        :return: The index of the Block that will hold this transaction
        """
        self.transaction = {
            'id': id,
            'category': category,
            'coins': coins,
            'made-by': by,
            'message': message
        }

        last_block = blockchain.last_block
        proof = blockchain.proof_of_work(last_block)
        previous_hash = blockchain.hash(last_block)
        blockchain.new_block(proof, previous_hash)

        return self.last_block['index'] + 1

    @property
    def last_block(self):
        return self.chain[-1]

    @staticmethod
    def hash(block):
        """
        Creates a SHA-256 hash of a Block

        :param block: Block
        """

        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()


    def proof_of_work(self, last_block):
        """
        Simple Proof of Work Algorithm:

         - Find a number p' such that hash(pp') contains leading 4 zeroes
         - Where p is the previous proof, and p' is the new proof
         
        :param last_block: <dict> last Block
        :return: <int>
        """

        last_proof = last_block['proof']
        last_hash = self.hash(last_block)

        proof = 0
        while self.valid_proof(last_proof, proof, last_hash) is False:
            proof += 1

        return proof


    @staticmethod
    def valid_proof(last_proof, proof, last_hash):
        """
        Validates the Proof

        :param last_proof: <int> Previous Proof
        :param proof: <int> Current Proof
        :param last_hash: <str> The hash of the Previous Block
        :return: <bool> True if correct, False if not.
        """

        guess = f'{last_proof}{proof}{last_hash}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

#def flask_app():
# Instantiate the Node
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()

@app.route('/users/login', methods=['POST'])
@cross_origin()
def validateUser():
    values = request.get_json()

    # Check that the required fields are in the POST'ed data
    required = ['id', 'password']
    if not all(k in values for k in required):
        return jsonify({'code':'400'})

    if isinstance(values['id'], int):
        if (db.validateUser(values['id'], values['password'])) == 1:
            userDetails = db.getUserDetails(values['id'])
            response = {"code":"200","id": values['id'], "name":f"{userDetails['name']} {userDetails['surname']}", "type":"user"}

            return jsonify(response)
    else:
        if (db.validateEmployee(values['id'], values['password'])) == 1:
            empDetails = db.getEmployeeDetails(values['id'])
            response = {"code":"200","id": values['id'], "name":f"{empDetails['name']} {empDetails['surname']}", "type":"employee"}
            return jsonify(response)
        
    return jsonify({'code':'201'})



@app.route('/users/register', methods=['POST'])
@cross_origin()
def insertUser():
    values = request.get_json()

    # Check that the required fields are in the POST'ed data
    required = ['name', 'surname', 'password']
    if not all(k in values for k in required):
        return '400'

    if (db.insertUser(values['name'], values['surname'], values['password'])):
        return '200'

    return '201'


@app.route('/mine', methods=['GET'])
def mine():
    # We run the proof of work algorithm to get the next proof...
    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block)
    id = '123456'
    category = "Health"
    coins = 12
    by = "John Wick"
    message = "Mined new block"

    # We must receive a reward for finding the proof.
    # The sender is "0" to signify that this node has mined a new coin.
    blockchain.new_transaction(id, category, coins, by, message)

    # Forge the new Block by adding it to the chain
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)

    response = {
        'message': "New Block Forged on the Discover Vitality blockchain",
        'index': block['index'],
        'transaction': block['transaction'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return response 

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

@app.route('/js/<filename>')
def serve_script(filename):
    return send_from_directory('static/js', filename)

@app.route('/transact', methods=['GET'])
def transact():
    return render_template('transact.html')

@app.route('/', methods=['GET'])
def login():
    return render_template('login.html')

@app.route('/post_transaction', methods=['POST'])
@cross_origin()
def post_transaction():
    values = request.get_json()

    # Check that the required fields are in the POST'ed data
    required = ['id', 'category', 'coins', 'by', 'message']
    if not all(k in values for k in required):
        return 'Missing values', 400

    if (db.checkUser(values['id']) == 1):
        # Create a new Transaction
        index = blockchain.new_transaction(values['id'], values['category'], values['coins'], values['by'], values['message'])

        response = {'message': f'Transaction added to Block {index-1}'}
        return jsonify(response), 201
    
    return jsonify("200")

@app.route('/home', methods=['GET'])
def home():
    time = datetime.now().strftime("%H:%M:%S")
    response = {"last_update":time}
    return render_template('home.html', data = response)

@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')

@app.route('/chain', methods=['GET'])
def chain():
    response = blockchain.chain
    return render_template('chain.html', chain = response, status=200)

@app.route('/block_chain', methods=['GET'])
def block_chain():
    response = {
        "chain": blockchain.chain,
        "length": len(blockchain.chain) 
    }
    return jsonify(response), 200

@app.route ('/chain_data', methods = ['GET'])
def chain_data():
    return jsonify({"chain": blockchain.chain})

@app.route ('/about', methods = ['GET'])
def about():
    return render_template('about.html')

@app.route ('/contact', methods = ['GET'])
def contact():
    return render_template('contact.html')


@app.route('/nodes/register', methods=['POST'])
@cross_origin()
def register_nodes():
    print("inside nodes register")
    values = request.get_json()

    nodes = values.get('nodes')
    print(nodes)
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'New node(s) added',
        'total_nodes': list(blockchain.nodes),
    }
    return jsonify(response), 201


@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    replaced = blockchain.resolve_conflicts()

    if replaced:
        response = {
            'message': 'Invalid chain has been replaced',
            'new_chain': blockchain.chain
        }
    else:
        response = {
            'message': 'This chain chain is authoritative',
            'chain': blockchain.chain
        }

    return jsonify(response), 200

@app.route('/change', methods=['GET'])
def change():
    return render_template('change.html', data = blockchain.chain)

@app.route('/resolve', methods=['POST'])
@cross_origin()
def resolve():
    values = request.get_json()
    if (values['chain'] == blockchain.chain):
        response = {"message":"This chain is valid and authoritative"}
    else:
        response = {"message":"This chain is not valid"}
    return jsonify(response)


if __name__ == '__main__':
    # from argparse import ArgumentParser

    # parser = ArgumentParser()
    # parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    # args = parser.parse_args()
    # port = args.port

    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
