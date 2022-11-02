import prisma from "../lib/prisma";

export const getStats = async (req: any, res: any) => {
  try {
    const stats = await prisma.stats.findMany();

    res.status(200).json(stats);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getStatById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const stat = await prisma.stats.findUnique({ where: { id: id } });

    res.status(200).json(stat);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createStat = async (req: any, res: any) => {
  let post = req.body;
  let stat;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    stat = await prisma.stats.create({ data: post });
    res.status(201).json(stat);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyStat = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    const stat = await prisma.stats.update({
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
    res.status(200).json(stat);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const deleteStat = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const stat = await prisma.stats.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(stat);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
