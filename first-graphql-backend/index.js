const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { nanoid } = require('nanoid');

const {authors, books} = require('./data');

// data nın tiplerini tanımlama
const typeDefs = gql`
    type DeleteAllOutput {
        count : Int!
    }
    # Author
    type Author {
        id : ID!
        name : String!
        surname : String
        age : Int
        books(filter: String) : [Book!]
    }

    input CreateAuhtorInput {
        name: String!, 
        surname: String!, 
        age: Int
    }

    input UpdateAuthorInput {
        name: String,
        surname: String,
        age: Int
    }

    # Book
    type Book {
        id : ID!
        title : String!
        author : Author
        author_id : String!
        score : Float
        isPublished : Boolean
    }

    input CreateBookInput {
        title: String!, 
        author_id: String!, 
        score: Float, 
        isPublished: Boolean
    }

    input UpdateBookInput {
        title: String,
        author_id: String,
        score: Float,
        isPublished: Boolean
    }

    # dokümanda çıkan kısım
    type Query {
        books : [Book!]
        book(id: ID!) : Book!
        authors : [Author!]
        author(id: ID!) : Author!
    }
    type Mutation {
        # Author
        createAuthor(data: CreateAuhtorInput!): Author!
        updateAuthor(id: ID!, data : UpdateAuthorInput!) : Author!
        deleteAuthor(id: ID!) : Author!
        deleteAllAuthors : DeleteAllOutput!

        # Book
        createBook(data: CreateBookInput! ): Book!
        updateBook(id: ID!, data: UpdateBookInput!): Book!
        deleteBook(id: ID!) : Book!
        deleteAllBooks : DeleteAllOutput!
    }

`;

// data yı getirecek func
const resolvers = {
    // CRUD işlemlerinden add,update,delete yapmayı sağlayan yapı (get işlemini query yapmakta)
    Mutation: {
        // Author
        //add (post) işlemlerini yapan functions
        createAuthor : (parent,{data : {name, surname, age}}) => {
            const author = { 
                id : nanoid(), 
                name: name, 
                surname: surname,
                age: age 
            };
            authors.push( author );
            return author;
        },
        updateAuthor : (parent,{id, data }) => {
            const author_index = authors.findIndex(author => author.id === id);
            if (author_index === -1) {
                throw new Error('Author not found');
            }
            authors[author_index].name = data.name;
            authors[author_index].surname = data.surname;
            authors[author_index].age = data.age;
            return authors[author_index];
        },
        deleteAuthor : (parent, { id }) => {
            const author_index = authors.findIndex(author => author.id === id);
            if (author_index === -1) {
                throw new Error('Author not found');
            }
            const deleted_author = authors[author_index];
            authors.splice(author_index,1)
            return deleted_author;
        },
        deleteAllAuthors : () => {
            const length = authors.length;
            authors.splice(0,length);
            return {
                count : length,
            }
        },
        // Book
        createBook : (parent,{data : {title, author_id, score, isPublished}}) => {
            const book = {
                id : nanoid(),
                title,
                author_id,
                score,
                isPublished
            };
            books.push( book );
            return book;
        },
        updateBook : (parent,{id, data }) => {
            const book_index = books.findIndex(book => book.id === id);
            if (book_index === -1) {
                throw new Error('Book not found');
            }
            const updated_book = (books[book_index] = {
                ...books[book_index],
                ...data,
            });
            return updated_book;
            /*
            books[book_index].title = data.title;
            books[book_index].author_id = data.author_id;
            books[book_index].score = data.score;
            books[book_index].isPublished = data.isPublished;
            return books[book_index]; 
            */
        },
        deleteBook : (parent, {id}) => {    
            const book_index = books.findIndex(book => book.id === id);
            if (book_index === -1) {
                throw new Error('Book not found');
            }
            const deleted_book = books[book_index];
            books.splice(book_index,1)
            return deleted_book;
        },
        deleteAllBooks : () => {
            const length = books.length;
            books.splice(0,length);
            return {
                count : length,
            }
        }
    },
    Query: {
        // query{} nin içerisinde erişebileceklerimiz
        books : () => books,
        book : (parameter, args) => books.find((book) => book.id === args.id),
        authors : () => authors,
        author : (parameter, args) => authors.find((author) => author.id === args.id)
    },
    Book: {
        author: (parent) => authors.find((author) => author.id === parent.author_id)
    },
    Author: {
        books : (parent,args) => {
            let filtered = books.filter((book) => book.author_id === parent.id );

            if (args.filter){
                filtered = filtered.filter((book) =>book.title.startsWith(args.filter));
            }
            return filtered;
        },
    }
};

// server ı tanımlama
const server = new ApolloServer({ 
    typeDefs , 
    resolvers, 
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]  
});

// server ı dinleme
server.listen().then(( { url }) => console.log(`Apollo server is up at ${url}`));