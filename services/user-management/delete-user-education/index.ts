public handleDeleteUserEducation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        body: { authorization, userId },
        params: { educationId },
        query: { key },
      } = req;

      await this.usersDb.deleteUserEducation({
        educationId,
        id: userId,
      });

      if (key) {
        await this.axios.delete({
          authorization,
          url: `${config.baseUrl.media}/media/certificate?key=${key}`,
        });
      }

      res
        .status(200)
        .json({ data: null, message: "Education deleted successfully" });
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode) {
        res
          .status(error.$metadata.httpStatusCode)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ data: null, message: `${error.name}: ${error.message}` });
      }
    }
  };