import { paginationFunction } from "./pagination.js"

export class APIFeatures {
    constructor(query, mongooseQuery) {
        this.query = query 
        this.mongooseQuery = mongooseQuery
    }


    pagination({ page, size }) {
    //  Get all products paginated 
        const { limit, skip } = paginationFunction({ page, size })  
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
        return this
    }


    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') 
        const [key, value] = formula.split(':')
        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }


    // Search on user with any field
    searchUsers(search) {
        const queryFiler = {}

        if (search.firstName) queryFiler.firstName = { $regex: search.firstName, $options: 'i' }
        if (search.email) queryFiler.email = { $regex: search.email, $options: 'i' }
        if (search.phoneNumber) queryFiler.phoneNumber = { $regex: search.phoneNumber, $options: 'i' }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }


    // Search on workers with any field
    searchWorkers(search) {
        const queryFiler = {}

        if (search.userName) queryFiler.userName = { $regex: search.userName, $options: 'i' }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }


    // Search on rooms with any field
    searchRooms(search){
        const queryFiler = {}

        if (search.name) queryFiler.name = { $regex: search.name, $options: 'i' }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
}