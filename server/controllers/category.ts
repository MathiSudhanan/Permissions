import prisma from "../lib/prisma";

export const getCategories = async (req: any, res: any) => {
  try {
    const categories = await prisma.categories.findMany();

    res.status(200).json(categories);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getCategoryById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const category = await prisma.categories.findUnique({ where: { id: id } });

    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createCategory = async (req: any, res: any) => {
  let post = req.body;
  let category;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    category = await prisma.categories.create({ data: post });
    res.status(201).json(category);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    const category = await prisma.categories.update({
      where: {
        id: id,
      },
      data: {
        name: post.name,
        description: post.description,
        isSecurityLevel: post.isSecurityLevel,
        isActive: post.isActive,
      },
    });
    res.status(200).json(category);
  } catch (error: any) {
    console.log(error);

    res.status(404).json({ mesage: error });
  }
};

export const deleteCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const category = await prisma.categories.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
