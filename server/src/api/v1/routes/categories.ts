import express, { Router, Request, Response } from 'express';
import { RawCategory } from '../../../model/raw_category';
import { Category } from '../../../model/category';

const router: Router = express.Router();
// Get /categories/getCategories
router.get('/createCategories', async (req: Request, res: Response) => {

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

      new Category({ name: rawCategory.name, developer: rawCategory.developer, image: `https://steamcdn-a.akamaihd.net/steam/apps/${rawCategory.appid}/library_600x900_2x.jpg`, weight: i }).save();
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
      return Category.find({}).sort({ weight: 'asc' }).skip( _page * 11 ).limit( 11 ).exec();
    };

    const categories = await getCategories(page);

    res.status(200).send(categories);
  } catch (e) {
    res.status(500).send(e?.toString());
  }
});


export default router;