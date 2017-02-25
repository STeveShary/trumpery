INITIALIZED=false
if [ -d "./mongoData" ]; then
    INITIALIZED=true
else
    mkdir -p mongoData
fi
docker run \
    --name mongo-trumpery \
    --detach \
    --volume $(pwd)/mongoData:/data/db \
    mongo --auth

if [[ $? -ne 0 ]]; then
    echo "**********************************"
    echo "  Error starting up mongo database"
    echo "**********************************"
    exit 1
fi

if [[ "$INITIALIZED" == "false" ]]; then
    echo "Waiting for database to start..."
    sleep 2
    echco "Setting up users and indexes..."
    docker exec -it mongo-trumpery mongo admin --eval "db.createUser({ user: 'userAdmin', pwd: '23jYefSFVniDZQgwnk', roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ] });"
    docker exec -it mongo-trumpery mongo admin -u userAdmin -p 23jYefSFVniDZQgwnk --authenticationDatabase admin --eval "db.getSiblingDB('trumpery').createUser({user: 'trumpery', pwd: 'trumpery', roles: ['dbAdmin', 'readWrite']})"
    docker exec -it mongo-trumpery mongo trumpery -u trumpery -p trumpery --eval "db.questions.createIndex({category: 1});"
    docker exec -it mongo-trumpery mongo trumpery -u trumpery -p trumpery --eval "db.responses.createIndex({gameCode: 1, participantCode: -1, questionNumber: -2});"
    docker exec -it mongo-trumpery mongo trumpery -u trumpery -p trumpery --eval "db.questions.createIndex({gameCode: 1, participantCode: -1, questionNumber: -2});"
fi
echo "**********************************"
echo "   Mongo is up and running..."
echo "**********************************"