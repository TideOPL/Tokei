import express, { Router, Request, Response } from 'express';
import { Category } from '../../../model/category';
// eslint-disable-next-line import/no-extraneous-dependencies
// import axios from 'axios';
// import { RawCategory } from '../../../model/raw_category';

const router: Router = express.Router();
// Get /categories/getCategories
// router.get('/createCategories', async (req: Request, res: Response) => {
//   const bannedPublishers = ['winged cloud', 't3 entertainment', 'atlus', 'huniepot', 'neko works', '落叶岛项目组, 橘子班', 'stage-nana', 'zloy krot studio', 'animu game', 'simon blasen', 'team psykskallar', 'cherry pop games', 'hanako games', 'sanctum games', 'lion games co', 'moonlit works', 'eternal dream'];

//   function delay(ms: number) {
//     return new Promise( resolve => setTimeout(resolve, ms) );
//   }

//   try {
//     // Category.collection.drop();
//     const getRawCategories = async () => {
//       return RawCategory.find({}).sort({ ccu: 'desc' }).exec();
//     };

//     const getCategories = async () => {
//       return Category.find({}).sort({ weight: 'asc' }).skip( 10 ).limit( 10 ).exec();
//     };

//     const getCategory = async (name: string) => {
//       return Category.findOne({ searchName: name }).exec();
//     };

//     const rawCategories = await getRawCategories();

//     for (let i = 0; i < rawCategories.length; i++) {
//       const rawCategory = rawCategories[i];

//       if (!rawCategory) {
//         continue;
//       }

//       if (bannedPublishers.includes(rawCategory.developer?.toString().toLowerCase() || '')) {
//         continue;
//       }

//       if (rawCategory.name?.toString().toLowerCase().includes('dedicated')) {
//         continue;
//       }

//       if (rawCategory.name == null) {
//         continue;
//       }


//       const searchName = rawCategory.name.toLowerCase().replaceAll("'", '').replaceAll(':', '').replaceAll(' ', '-');
//       console.log(rawCategory.name);
//       const category = await getCategory(searchName);
//       console.log(category);
//       if (category) {
//         continue;
//       }


//       let tags: string[] = [];
//       let description = '';
//       let age = '';
//       if (rawCategory.appid) {
//         const { data } = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${rawCategory.appid}`);
//         console.log(rawCategory.name);
//         try {
//           data[rawCategory.appid].data.genres.map((tag: { id: string, description: string }) => (
//             tags.push(tag.description)
//           ));
//         } catch (err) {}

//         try {
//           age = data[rawCategory.appid].data.required_age;
//         } catch (err) {}
//         try {
//           description = data[rawCategory.appid].data.short_description;
//         } catch (err) {}
//       }
    

//       new Category({ name: rawCategory.name, developer: rawCategory.developer, image: `https://steamcdn-a.akamaihd.net/steam/apps/${rawCategory.appid}/library_600x900.jpg`, weight: i, searchName: searchName, tags: tags, description: description, age: age }).save();
//       await delay(1500);
//     }
    

//     const categories = await getCategories();
    
    

//     res.status(200).send(categories);
//   } catch (e) {
//     res.status(500).send(e?.toString());
//   }
// });

// Get /categories/getCategories
router.get('/getCategories', async (req: Request, res: Response) => {

  try {
    let page = 0;
    if (req.query.page) {
      page = parseInt(req.query.page.toString());
    }

    const getCategories = async (_page: number) => {
      return Category.find({}).sort({ weight: 'asc' }).skip( _page * 10 ).limit( 10 ).exec();
    };

    const categories = await getCategories(page);

    res.status(200).send(categories);
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

router.get('/searchCategory', async (req: Request, res: Response) => {
  try { 
    if (req.query.search == null) {
      res.status(400).send();
      return;
    }
  
    const getCategories = async () => {
      return Category.find({}).exec();
    };
  
    const query = req.query.search?.toString().toLowerCase();
  
    if (!query) {
      res.status(500).send();
      return;
    }
  
    const categories = await getCategories();
    
    const response = categories.filter((category) => category.name?.toLowerCase().includes(query));
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }

});

router.get('/getCategoryById', async (req: Request, res: Response) => {
  try { 
    if (req.query.id == null) {
      res.status(400).send();
      return;
    }
  
    const getCategory = async () => {
      return Category.findById(req.query.id).exec();
    };
  
    const query = req.query.search?.toString().toLowerCase();
  
    if (!query) {
      res.status(500).send();
      return;
    }
  
    const categories = await getCategory();
    
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send(err);
  }

});

router.get('/getCategoryByName', async (req: Request, res: Response) => {
  try { 
    if (req.query.category == null) {
      res.status(400).send();
      return;
    }
  
    const getCategory = async () => {
      return Category.find({ searchName: req.query.category?.toString().toLowerCase() }).exec();
    };
  
    const category = await getCategory();
    
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send(err);
  }

});

router.post('/createCategory', async (req: Request, res: Response) => {
  try {
    if (req.body.name == null || req.body.image == null || req.body.weight == null || req.body.searchName == null || req.body.tags == null || req.body.description == null || req.body.age == null) {
      res.status(401).send();
    }
  
    const category = await Category.create({ name: req.body.name, image: req.body.image, weight: req.body.weight, searchName: req.body.searchName, tags: req.body.tags, description: req.body.description, age: req.body.age, developer: req.body.developer });

    res.status(200).send(category);  
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;