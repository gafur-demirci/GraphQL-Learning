// data tanımlama
const authors = [
    {
        id : '1',
        name : 'Gafur',
        surname : 'Demirci',
        age : 25,
    },
    {
        id : '2',
        name : 'Abdulgafur',
        surname : 'Demirci',
        age : 26,
    }
]

const books = [
    {
        id : "1",
        title : 'Yabancı',
        author_id : "1",
        score : 12.2,
        isPublished : true
    },
    {
        id : "2",
        title : 'Yerli',
        author_id :"2",
        score : 10.2,
        isPublished : false
    },
    {
        id : "3",
        title : 'Tabanca',
        author_id : "1",
        score : 12.2,
        isPublished : true
    },
    {
        id : "4",
        title : 'Yerli',
        author_id : "2",
        score : 12.2,
        isPublished : true
    },
];

module.exports = {
    books,
    authors
}