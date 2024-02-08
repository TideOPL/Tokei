import express, { Router, Request, Response } from 'express';
import { RawCategory } from '../../../model/raw_category';
import { Category } from '../../../model/category';

const router: Router = express.Router();
// Get /categories/getCategories
router.get('/createCategories', async (req: Request, res: Response) => {

  const bannedPublishers = ['winged cloud', 't3 entertainment', 'atlus', 'huniepot', 'neko works', '落叶岛项目组, 橘子班', 'stage-nana', 'zloy krot studio', 'animu game', 'simon blasen', 'team psykskallar', 'cherry pop games', 'hanako games', 'sanctum games', 'lion games co', 'moonlit works', 'eternal dream'];

  try {
    Category.collection.drop();
    const getRawCategories = async () => {
      return RawCategory.find({}).sort({ ccu: 'desc' }).exec();
    };

    const getCategories = async () => {
      return Category.find({}).sort({ weight: 'asc' }).skip( 10 ).limit( 10 ).exec();
    };

    const rawCategories = await getRawCategories();

    for (let i = 0; i < rawCategories.length; i++) {
      const rawCategory = rawCategories[i];

      if (!rawCategory) {
        continue;
      }

      if (bannedPublishers.includes(rawCategory.developer?.toString().toLowerCase() || '')) {
        continue;
      }

      if (rawCategory.name?.toString().toLowerCase().includes('dedicated')) {
        continue;
      }

      new Category({ name: rawCategory.name, developer: rawCategory.developer, image: `https://steamcdn-a.akamaihd.net/steam/apps/${rawCategory.appid}/library_600x900.jpg`, weight: i }).save();
    }
    

    const categories = await getCategories();

    res.status(200).send(categories);
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});

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


export default router;