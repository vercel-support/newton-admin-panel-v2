import { AppDataSource } from '../connection';
import { Patient } from '../entity/Patient';
import { FindManyOptions } from 'typeorm';

//SaveNewPatient
export const saveNewPatient = async (
  payload: any
) => {
  try {
    const patientRepository = AppDataSource.getRepository(Patient);
    const response = patientRepository.save(payload);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// UpdatePatient
export const updatePatient = async (id: number, payload: Partial<Patient>) => {
  try {
    const patientRepository = AppDataSource.getRepository(Patient);
    const patient = await patientRepository.findOne({ where: { id } });

    if (!patient) throw new Error('Patient not found');

    await patientRepository.update(id, payload);
    const updatedPatient = await patientRepository.findOne({ where: { id } });
    return updatedPatient;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// DeletePatient
export const deletePatient = async (id: number) => {
  try {
    const patientRepository = AppDataSource.getRepository(Patient);
    const result = await patientRepository.delete(id);
    return result.affected;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// GetPatient
export const getPatient = async (id: number) => {
  try {
    const patientRepository = AppDataSource.getRepository(Patient);
    const patient = await patientRepository.findOne({ where: { id } });
    if (!patient) throw new Error('Patient not found');
    return patient;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// GetPatients
export const getPatients = async (filter: FindManyOptions<Patient>) => {
  try {
    const patientRepository = AppDataSource.getRepository(Patient);
    const patients = await patientRepository.find(filter);
    return patients;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//GetAllPatients
export const getAllPatients = async () => {
  try {
    const query = AppDataSource
      .getRepository(Patient)
      .createQueryBuilder('patient');

    const [results, count] = await query.getManyAndCount();
    return results;

  } catch (error) {
    console.log(error);
    return error
  }
};


