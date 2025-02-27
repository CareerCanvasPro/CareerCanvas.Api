-- CreateTable
CREATE TABLE "personality_test_questions" (
    "question_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "category" VARCHAR(2) NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "personality_test_questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "personality_test_answers" (
    "answer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "answer" INTEGER NOT NULL,

    CONSTRAINT "personality_test_answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personality_test_answers_user_id_question_id_key" ON "personality_test_answers"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "personality_test_answers" ADD CONSTRAINT "personality_test_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "personality_test_questions"("question_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personality_test_answers" ADD CONSTRAINT "personality_test_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
