require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const HASURA_URL = process.env.HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Helper function to make GraphQL requests
const graphqlRequest = async (query, variables) => {
    try {
        const response = await axios.post(
            HASURA_URL,
            { query, variables },
            {
                headers: {
                    'x-hasura-admin-secret': HASURA_ADMIN_SECRET
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('GraphQL request error:', error);
        throw error;
    }
};
console.log("graphql request accepted");
// Endpoints for deposits and withdrawals
app.post('/deposit', async (req, res) => {
    const { userId, amount } = req.body;
    
    const query = `
        mutation ($userId: Int!, $amount: numeric!) {
            update_users(where: {id: {_eq: $userId}}, _inc: {balance: $amount}) {
                returning {
                    id
                    balance
                }
            }
            insert_transactions(objects: {user_id: $userId, type: "deposit", amount: $amount}) {
                returning {
                    id
                    created_at
                }
            }
        }
    `;
    
    try {
        const result = await graphqlRequest(query, { userId, amount });
        res.json(result);
    } catch (error) {
        res.status(500).send('Error performing deposit');
    }
});

app.post('/withdraw', async (req, res) => {
    const { userId, amount } = req.body;
  
    const query = `
      mutation ($userId: Int!, $amount: numeric!) {
        update_users(where: {id: {_eq: $userId}}, _inc: {balance: $amount}) {
          returning {
            id
            balance
          }
        }
        insert_transactions(objects: {user_id: $userId, type: "withdrawal", amount: $amount}) {
          returning {
            id
            created_at
          }
        }
      }
    `;
  
    try {
      const result = await graphqlRequest(query, { userId, amount: -amount });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error performing withdrawal');
    }
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
