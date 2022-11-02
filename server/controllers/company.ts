import prisma from "../lib/prisma";

export const getCompanies = async (req: any, res: any) => {
  try {
    const companies = await prisma.companies.findMany();

    res.status(200).json(companies);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getCompanyById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const company = await prisma.companies.findUnique({ where: { id: id } });

    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createCompany = async (req: any, res: any) => {
  let post = req.body;
  let company;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    company = await prisma.companies.create({ data: post });
    res.status(201).json(company);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyCompany = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    const company = await prisma.companies.update({
      where: {
        id: id,
      },
      data: {
        name: post.name,
        description: post.description,
        isActive: post.isActive,
      },
    });
    res.status(200).json(company);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const deleteCompany = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const company = await prisma.companies.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
