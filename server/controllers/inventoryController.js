const Product = require("../modules/productSchema")

async function addNewItem(req, res) {
    const postData = req.body;
    try {
        const product = await Product.find({ barCode: postData.barcode });
        if (product.length > 0) {
            res.json({ statusCode: "E1000", message: "Item with the barcode already exists" })
        } else {
            const newProduct = new Product({
                productName: postData.productName,
                barCode: postData.barcode,
                category: postData.category,
                image: postData.imgUrl,
                varientName: postData.varientName,
                brandName: postData.brandName,
                size: postData.size,
                reOrder: postData.reorder,
                tax: postData.tax,
                comments: postData.comments
            })
            await newProduct.save().then(() => {
                res.json({ message: "Item saved successfully", statusCode: 200 })
            })
        }

    } catch (e) {
        res.json({ statusCode: 404, message: e.message })
    }
}
module.exports = { addNewItem }