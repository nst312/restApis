import Product from "../model/product.js";


const aggrigationController = {
    // https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/         :- for aggregation
    //https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/
    async aggregate(req, rse, next) {
        const pipeline1 = [
            {
                // for price graterThen and less then
                $match: {
                    'price': {$gte: 200, $lt: 1400}
                }
            },
            {
                // this grouping takes all the data in under one id which helps us to perform various operation like- totalSum, average
                // $sum -  for sum calculation || $multiply: [ "$x", "$y" ] - for multiplication of to or more things || $avg: "$x" - get average value
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    totalPrice: {
                        $sum: '$price'
                    },
                    averagePrice: {
                        $avg: '$price'
                    }
                }
            },
            {
                // for get data like ascending(1) and descending(-1) order
                $sort: {price: 1}
            },
            //for remove field from UI
            {$unset: "price"}
        ]

        const pipeline2 = [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoriId',
                    foreignField: '_id',
                    as: 'category',
                    // in this pipeline case we can done all the operation in joined collection that can be done in above pipeline
                    pipeline: [{
                        $unset: ["updatedAt", "__v"]
                    }]

                }
            },
            {$unset: ["categoriId", "updatedAt", "__v"]}
        ]

        const pipeline3 = [
            {
                $match: {
                    price: {$gte: 1000}
                },
            },
            // {
            //     // this $project helps us to select only specific entity to UI
            //     $project: {
            //         name: 1,
            //         //we can add field at time of UI
            //         'testId': "test"
            //     }
            // },
            //https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceRoot/#mongodb-pipeline-pipe.-replaceRoot
            { $match: { name : { $exists: true, $not: { $type: "array" }, $type: "object" } } },
            { $replaceRoot: { newRoot: "$name" } }
            ]
        const data = await Product.aggregate(pipeline3)
        rse.json(data)
    }
}

export default aggrigationController