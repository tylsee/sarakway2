const request = require('supertest');
const app = require('../../index');
const db = require('../../db');

jest.setTimeout(25000); // Increased slightly for the extra DB operations

describe('Courses & Quizzes API Integration', () => {
  // 1. Create the fake user BEFORE tests run to satisfy the Foreign Key constraint
  beforeAll((done) => {
    // Notice: We removed the password column because Cognito handles it!
    const createDummyUser = `
      INSERT INTO users (user_id, user_name, email, role_id) 
      VALUES (1000, 'Automated Test Guide', 'dummy1000@sarakway.com', 2)
      ON DUPLICATE KEY UPDATE user_name = 'Automated Test Guide';
    `;
    
    db.query(createDummyUser, (err) => {
      if (err) {
        console.error("CRITICAL SETUP ERROR:", err.message);
      }
      done();
    });
  });

  // 2. Delete the fake user AFTER tests run to keep the database perfectly clean
  afterAll((done) => {
    db.query(`DELETE FROM users WHERE user_id = 1000`, () => {
      db.end(); 
      done();
    });
  });

  // We need to store these IDs as we build the course hierarchy
  let testCourseId = ''; 
  let testModuleId = '';
  let testLessonId = '';
  let testQuizId = '';
  const testGuideId = 1000;

  // =========================================================================
  // ADMINISTRATOR TESTS: Building the Course Hierarchy
  // =========================================================================
  describe('Administrator Interface: Course & Quiz Creation', () => {
    
    it('1. should successfully create a new course (Draft)', async () => {
      const response = await request(app).post('/courses').send({
        course_name: 'SarakWay Flora & Fauna Training',
        description: 'Comprehensive guide training with quizzes.',
        status: 'Draft',
        is_mandatory: true
      });
      
      expect(response.statusCode).toBe(200);
      testCourseId = response.body.course_id; 
    });

    it('2. should create a Module inside the Course', async () => {
      const response = await request(app).post('/modules').send({
        course_id: testCourseId,
        module_title: 'Module 1: Local Ecosystems',
        order_index: 1
      });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('module_id');
      testModuleId = response.body.module_id;
    });

    it('3. should create a Lesson inside the Module', async () => {
      const response = await request(app).post('/lessons').send({
        module_id: testModuleId,
        lesson_title: 'Understanding Mangroves',
        duration: 15
      });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('lesson_id');
      testLessonId = response.body.lesson_id;
    });

    it('4. should successfully edit the Lesson details', async () => {
      const response = await request(app)
        .put(`/lessons/${testLessonId}`)
        .send({
          lesson_title: 'Understanding Mangroves (Advanced)',
          lesson_content: 'Added a new section regarding coastal erosion.',
          duration: 25, // Updated from 15
          video_url: 'https://example.com/mangrove-video.mp4'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'lesson updated');
    });

    it('5. should create a Quiz inside the Module with a Passing Score', async () => {
      const response = await request(app).post('/quizzes').send({
        module_id: testModuleId,
        quiz_title: 'Mangrove Ecosystem Quiz',
        passing_score: 80 // Admin determines passing score here!
      });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('quiz_id');
      testQuizId = response.body.quiz_id;
    });

    it('6. should add a Question to the Quiz', async () => {
      const response = await request(app).post('/quiz-questions').send({
        quiz_id: testQuizId,
        question_text: 'Which tree species dominates the coastal areas?',
        option_a: 'Pine',
        option_b: 'Mangrove',
        option_c: 'Oak',
        option_d: 'Bamboo',
        correct_answer: 'option_b'
      });
      
      expect(response.statusCode).toBe(200);
    });

    it('7. should publish the fully built course', async () => {
      const response = await request(app).put(`/courses/${testCourseId}`).send({
        course_name: 'SarakWay Flora & Fauna Training',
        status: 'Published'
      });
      
      expect(response.statusCode).toBe(200);
    });
  });

  // =========================================================================
  // PARK GUIDE TESTS: Learning and Assessment
  // =========================================================================
  describe('Park Guide Interface: Lessons & Quizzes', () => {
    
    it('8. should mark the Lesson as completed', async () => {
      const response = await request(app).post('/courses/lessons/complete').send({
        user_id: testGuideId,
        lesson_id: testLessonId
      });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'lesson completed');
    });

    it('9. should record a FAILED quiz attempt and NOT complete the course', async () => {
      const response = await request(app).post('/quiz-attempts').send({
        user_id: testGuideId,
        quiz_id: testQuizId,
        score: 50, // Below the 80 passing score
        passed: false
      });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('is_completed', false);
    });

    it('10. should record a PASSED quiz attempt and update Course Progress', async () => {
      const response = await request(app).post('/quiz-attempts').send({
        user_id: testGuideId,
        quiz_id: testQuizId,
        score: 100, // Passed!
        passed: true
      });
      
      expect(response.statusCode).toBe(200);
      // Because this is the only quiz in the course, passing it means the course is 100% complete!
      expect(response.body).toHaveProperty('is_completed', true);
      expect(response.body).toHaveProperty('progress_percentage', 100);
    });
  });

  // =========================================================================
  // ADMINISTRATOR CLEANUP
  // =========================================================================
  describe('Administrator Interface: Data Cleanup', () => {
    
    it('11. should delete the course and cascade delete all modules, lessons, and quizzes', async () => {
      // Because your backend courses.js uses a massive cascading DELETE query, 
      // destroying the course cleans up everything we just built!
      const response = await request(app).delete(`/courses/${testCourseId}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'course deleted');
    });
  });
});