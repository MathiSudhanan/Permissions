import prisma from "../lib/prisma";

export const getFunds = async (req: any, res: any) => {
  try {
    const funds = await prisma.funds.findMany();

    res.status(200).json(funds);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getFundById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const fund = await prisma.funds.findUnique({ where: { id: id } });

    res.status(200).json(fund);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createFund = async (req: any, res: any) => {
  let post = req.body;
  let fund;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    fund = await prisma.funds.create({ data: post });
    res.status(201).json(fund);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyFund = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    const fund = await prisma.funds.update({
      where: {
        id: id,
      },
      data: {
        name: post.name,
        description: post.description,
        startDate: post.startDate,
        endDate: post.endDate,
        isSecurityLevel: post.isSecurityLevel,
        isFOF: post.isFOF,
        isActive: post.isActive,
      },
    });
    res.status(200).json(fund);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const deleteFund = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const fund = await prisma.funds.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(fund);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
