const fs = require('fs')


const pets = JSON.parse(fs.readFileSync('./dev-data/pets.json'))

 exports.checkID = ((req, res, next, val) => {
    console.log(`pet id is ${val} 🐶`)
    if (val > pets.length) {
        return res.status(404).json({
            status: 'fail',
            messgae: 'Invalid Id'
        })
    }
    next()
})

exports.getAllPets = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        results: pets.length,
        data: {
            pets
        }
    })
}

exports.createNewPet = (req, res) => {

    const newId = pets[pets.length - 1].id + 1
    const newPet = Object.assign({ id: newId }, req.body)

    pets.push(newPet)

    fs.writeFile('./dev-data/pets.json', JSON.stringify(pets), err => {
        res.status(201).json({
            status: 'success',
            data: {
                newPet
            }
        })
    })
}

exports.editPet = (req, res) => {
    const id = req.params.id * 1;
    const pet = pets.find(pet => pet.id === id);

    const updatedPet = { ...pet, ...req.body };
    const updatedPets = pets.map(pet =>
        pet.id === updatedPet.id ? updatedPet : pet
    );

    fs.writeFile(
        `${__dirname}/dev-data/pets.json`,
        JSON.stringify(updatedPets),
        err => {
            res.status(200).send({
                status: 'success',
                data: updatedPet
            });
        }
    );
}

exports.getPet = (req, res) => {

    const id = req.params.id * 1
    const pet = pets.find(pet => pet.id === id)

    res.status(200).json({
        status: 'succsess',
        data: {
            pet
        }
    })
}

exports.deletePet = (req, res) => {
    const id = req.params.id * 1
    const pet = pets.find(pet => pet.id === id)

    const updatedPets = pets.filter(pet => pet.id !== id)
    fs.writeFile(`${__dirname}/dev-data/pets.json`, JSON.stringify(updatedPets), err => {
        res.status(204).json({
            status: 'success',
            data: null
        })
    })
}