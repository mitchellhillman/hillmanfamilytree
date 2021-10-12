import data from './data.js'
// import * as d3 from 'd3'
// import fs from 'fs'

const persons = data.map(person => {
    const withParents = { ...person, notes: 'temp removed', parents: [] }
    if (person.father) withParents.parents.push(person.father)
    if (person.mother) withParents.parents.push(person.mother)
    return withParents
}) 

const keyedGenerations = persons
    .reduce((acc,curr) => {
        acc[curr.father] = acc[curr.father] || []
        acc[curr.father].push(curr) 
        return acc
    }, Object.create(null))
   

const generations = Object.keys(keyedGenerations)
    .map(father => keyedGenerations[father])
    .sort((a, b) => {
        if(b[0].id === a[0].father) return 1
        return -1
    })

const getFullname = person => 
    `${person.firstname} ${person.middlename ? person.middlename + ' ' : ''}${person.lastname} ${person.suffix}`

console.log('generations', generations.map(gen => gen.map(getFullname)));
// fs.writeFile('familytree.svg', renderChart(generations), () => { console.log('SVG created'); })