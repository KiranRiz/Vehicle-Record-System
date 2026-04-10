const request = require('supertest');
const express = require('express');
const router = require('./users');

jest.mock('../models/User');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/', router);

// POST 
describe('POST / - Create a new user', () => {
  const validPayload = {
    userName: 'John Doe',
    userRegNo: 'REG123',
    mobile: '0871234567',
    assignDate: '2024-01-01',
    vehicleReg: 'VEH456'
  };

  beforeEach(() => jest.clearAllMocks());

  it('should create a user and return 201', async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    User.mockImplementation(() => ({ ...validPayload, save: mockSave }));

    const res = await request(app).post('/').send(validPayload);

    expect(res.status).toBe(201);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if any field is missing', async () => {
    const { userName, ...missingField } = validPayload;

    const res = await request(app).post('/').send(missingField);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('All fields are required');
  });

  it('should return 500 if saving fails', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('DB error'));
    User.mockImplementation(() => ({ save: mockSave }));

    const res = await request(app).post('/').send(validPayload);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to create user');
  });
});

// GET 
describe('GET /:id - Get single user by ID', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    userName: 'John Doe',
    userRegNo: 'REG123',
    mobile: '0871234567',
    assignDate: '2024-01-01',
    vehicleReg: 'VEH456'
  };

  beforeEach(() => jest.clearAllMocks());

  it('should return a user and 200 when found', async () => {
    User.findById.mockResolvedValue(mockUser);

    const res = await request(app).get(`/${mockUser._id}`);

    expect(res.status).toBe(200);
    expect(res.body.userName).toBe('John Doe');
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
  });

  it('should return 404 if user does not exist', async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).get('/507f1f77bcf86cd799439011');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should return 500 if database query fails', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/507f1f77bcf86cd799439011');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch user');
  });
});

describe('PUT /:id - Update a user by ID', () => {
  const mockId = '507f1f77bcf86cd799439011';
  const updatePayload = {
    userName: 'Jane Doe',
    mobile: '0871234568'
  };
  const updatedUser = {
    _id: mockId,
    userName: 'Jane Doe',
    userRegNo: 'REG123',
    mobile: '0871234568',
    assignDate: '2024-01-01',
    vehicleReg: 'VEH456'
  };

  beforeEach(() => jest.clearAllMocks());

  
  it('should update a user and return 200', async () => {
    User.findByIdAndUpdate.mockResolvedValue(updatedUser);

    const res = await request(app).put(`/${mockId}`).send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body.userName).toBe('Jane Doe');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      updatePayload,
      { new: true, runValidators: true }
    );
  });

 
  it('should return 404 if user does not exist', async () => {
    User.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put(`/${mockId}`).send(updatePayload);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

 
  it('should return 500 if database query fails', async () => {
    User.findByIdAndUpdate.mockRejectedValue(new Error('DB error'));

    const res = await request(app).put(`/${mockId}`).send(updatePayload);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to update user');
  });
});

describe('DELETE /:id - Delete a user by ID', () => {
  const mockId = '507f1f77bcf86cd799439011';
  const deletedUser = {
    _id: mockId,
    userName: 'John Doe',
    userRegNo: 'REG123',
    mobile: '0871234567',
    assignDate: '2024-01-01',
    vehicleReg: 'VEH456'
  };

  beforeEach(() => jest.clearAllMocks());

 
  it('should delete a user and return 200', async () => {
    User.findByIdAndDelete.mockResolvedValue(deletedUser);

    const res = await request(app).delete(`/${mockId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
    expect(res.body.deletedUser.userName).toBe('John Doe');
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockId);
  });

 
  it('should return 404 if user does not exist', async () => {
    User.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete(`/${mockId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  
  it('should return 500 if database query fails', async () => {
    User.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

    const res = await request(app).delete(`/${mockId}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to delete user');
  });
});