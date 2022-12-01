import prisma from "../lib/prisma";

export const getClientFunds = async (req: any, res: any) => {
  try {
    const clientFunds = await prisma.clientFunds.findMany();

    res.status(200).json(clientFunds);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getClientFundsByCompanyId = async (req: any, res: any) => {
  try {
    const { companyId } = req.params;
    const clientFunds = await prisma.clientFunds.findMany({
      where: { companyId: companyId },
    });

    res.status(200).json(
      clientFunds.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      })
    );
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getClientFundById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const clientFund = await prisma.clientFunds.findUnique({
      where: { id: id },
    });

    res.status(200).json(clientFund);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createClientFund = async (req: any, res: any) => {
  let post = req.body;
  let clientFund;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    post.Company = { connect: { id: post.companyId } };
    post.Fund = { connect: { id: post.fundId } };

    delete post["fundId"];
    delete post["companyId"];

    clientFund = await prisma.clientFunds.create({ data: post });
    res.status(201).json(clientFund);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyClientFund = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    post.Company = { connect: { id: post.companyId } };
    post.Fund = { connect: { id: post.fundId } };

    delete post["fundId"];
    delete post["companyId"];

    const clientFund = await prisma.clientFunds.update({
      where: {
        id: id,
      },
      data: {
        name: post.name,
        description: post.description,
        startDate: post.startDate,
        endDate: post.endDate,
        isSecurityLevel: post.isSecurityLevel,
        isActive: post.isActive,

        Company: post.Company,
        Fund: post.Fund,
      },
    });
    res.status(200).json(clientFund);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const deleteClientFund = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const clientFund = await prisma.clientFunds.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(clientFund);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
