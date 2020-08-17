const {
    getProduct,
    getProductCount,
    getProductById,
    getProductByName,
    postProduct,
    patchProduct,
    deleteProduct } = require('../model/product')
const qs = require('querystring')
const helper = require('../helper/index')

const getPrevLink = (page, currentQuery) => {
    if (page > 1) {
        const generatedPage = {
            page: page - 1
        }
        const resultPrevLink = { ...currentQuery, ...generatedPage }
        return qs.stringify(resultPrevLink)
    } else {
        return null
    }
}

const getNextLink = (page, totalPage, currentQuery) => {
    if (page < totalPage) {
        const generatedPage = {
            page: page + 1
        }
        const resultNextLink = { ...currentQuery, ...generatedPage }
        return qs.stringify(resultNextLink)
    } else {

    }
}

module.exports = {
    getProduct: async (request, response) => {
        let { page, limit, sort } = request.query
        page === undefined ? page = 1 : parseInt(page)
        limit === undefined ? limit = 3 : parseInt(limit)
        if (sort === undefined) {
            sort = 'product_id'
        }
        let totalData = await getProductCount()
        let totalPage = Math.ceil(totalData / limit)
        let offset = page * limit - limit
        let prevLink = getPrevLink(page, request.query)
        let nextLink = getNextLink(page, totalPage, request.query)
        const pageInfo = {
            page,
            totalPage,
            limit,
            totalData,
            prevLink: prevLink && `http://127.0.0.1:3001/product?${prevLink}`,
            nextLink: nextLink && `http://127.0.0.1:3001/product?${nextLink}`
        }
        try {
            const result = await getProduct(limit, offset, sort);
            return helper.response(response, 200, "Success Get Product", result, pageInfo)
        } catch (error) {
            console.log(error)
            // return helper.response(response, 400, "Bad Request", error)
        }
    },
    getProductById: async (request, response) => {
        try {
            // const id = request.params.id
            const { id } = request.params
            const result = await getProductById(id)
            if (result.length > 0) {
                return helper.response(response, 200, "Success Get Product By ID", result)
            } else {
                return helper.response(response, 404, `Product By Id : ${id} Not Found`)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    getProductByName: async (request, response) => {
        try {
            const { keyword } = request.params
            const result = await getProductByName(keyword)
            if (result.length > 0) {
                return helper.response(response, 201, 'Success Get Product By Name', result)
            } else {
                return helper.response(response, 404, `Product ${name} Not Found`, error)
            }
            // console.log(result)
        } catch (error) {
            return helper.response(response, 400, 'Bad Request', error)
            // console.log(error)
        }
    },
    postProduct: async (request, response) => {
        try {
            const { category_id, product_name, product_harga, product_status } = request.body
            const setData = {
                category_id,
                product_name,
                product_harga,
                product_created_at: new Date(),
                product_status
            }
            const result = await postProduct(setData)
            return helper.response(response, 201, "Product Created", result)
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    patchProduct: async (request, response) => {
        try {
            const { id } = request.params
            const { category_id, product_name, product_harga, product_status } = request.body
            const setData = {
                category_id,
                product_name,
                product_harga,
                product_updated_at: new Date(),
                product_status
            }
            const checkId = await getProductById(id)
            if (checkId.length > 0) {
                const result = await patchProduct(setData, id)
                return helper.response(response, 201, "Product Updated", result)
            } else {
                return helper.response(response, 404, `Product By Id : ${id} Not Found`)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    deleteProduct: async (request, response) => {
        try {
            const { id } = request.params
            const result = await deleteProduct(id)
            return helper.response(response, 201, "Product Deleted", result)
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    }
}