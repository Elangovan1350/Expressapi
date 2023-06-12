import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect("mongodb+srv://admin:admin@mern.yeiznam.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    if (res) {
      console.log("database is connected");
    } else {
      console.log("not connected");
    }
  });

const productSchema = mongoose.Schema(
  {
    title:String,
    price:Number,
    image:String,
    description:String,
    category:String
  },
  {
    versionkey: false,
  }
);

const products = new mongoose.model("popo", productSchema);

app.get("/", async (req, res) => {
  const getAll = await products.find();
  res.json(getAll);
});

app.get("/:id",async(req,res)=>{
  const{id}=req.params
  const getOne = await products.findById(id)
  res.status(200).json(getOne)
})

app.post("/", async (req, res) => {
  const { title,price,description,image,category } = req.body;
  const vandu = await new products({ title,price,description,image,category });
  vandu.save().then((resq) => {
    if (resq) {
      console.log("data saved");
      res.status(200).json({vandu,message:"data saved"});
    } else {
      console.log("data not saved");
      res.status(400).json(vandu);
    }
  });
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid) {
    return res.status(404).json({ message: "not valid" });
  }
  try {
    const task = await products.findByIdAndDelete(id);
    return res.status(200).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const update = await products.findByIdAndUpdate({ _id: id }, { ...req.body });
  res.status(200).json(update);
});

app.listen(4000, (req, res) => {
  console.log("connected to server 4000");
});
