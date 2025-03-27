public handleFindUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { authorization, userId } = req.body;

      const { user } = await this.usersDb.findUser({
        id: userId,
      });

      if (user) {
        const { educations, resumes } = user;

        for (const education of educations) {
          if (education.certificate) {
            const { certificate } = education;

            const {
              data: { data },
            } = await this.axios.get({
              authorization,
              url: `${config.baseUrl.media}/media/signed-url?key=${certificate.key}`,
            });

            certificate["url"] = data["signedUrl"];
          }
        }

        for (const resume of resumes) {
          const {
            data: { data },
          } = await this.axios.get({
            authorization,
            url: `${config.baseUrl.media}/media/signed-url?key=${resume.key}`,
          });

          resume["url"] = data["signedUrl"];
        }

        res
          .status(200)
          .json({ data: user, message: "Profile retrieved successfully" });
      } else {
        res.status(404).json({ data: null, message: "Profile not found" });
      }
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