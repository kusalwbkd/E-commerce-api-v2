import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
	{
		sales_item: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		
		numOfItems: {
			type: Number,
			required: true,
			
		},
        
		total: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Sale = mongoose.model("Sale", salesSchema);

export default Sale;