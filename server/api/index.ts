import 'reflect-metadata';
import { AppDataSource } from '~~/typeorm/connection';
import { addNewNote, updateNote, deleteNote, getNotesByPatientId } from '~/typeorm/repositories/NoteRepository';
import { Note } from '~/typeorm/entity/Note';
import { addEntry, updateEntry } from '~/typeorm/repositories/EntryRepository';

AppDataSource.initialize().then(async () => {
    console.log('SERVER IS RUNNING WITH TYPEORM');
    const notePayload: any = {
        visitDate: new Date(),
        visitTime: new Date(),
        heightFeet: 5,
        heightInches: 10,
        temperature: 13,
        respiration: 16,
        systolic: 120,
        diastolic: 80,
        physiotherapy: 1,
        roomAssignment: 101,
        physio: 1,
        tx: 1,
        otherNotes: "Some other notes",
      };
      
      const patientId = 3; // Replace this with the actual patient ID
      
      const res : any = await addNewNote(notePayload, patientId);
    //   console.log('response is ', res);
    //   const res2 : any = await updateNote(res.id, { otherNotes: 'Some other notes 2' });
    //   console.log('response 2 is ', res2);
        // const res3 = await deleteNote(res2.id);
        // console.log('response 3 is ', res3);
    const notesForPatient = await getNotesByPatientId(3);
    const newEntryData: any = {
        category: 'spinal',
        region: 'upper-cerv',
        side: 'l',
        sublux: true,
        muscleSpasm: true,
        triggerPoints: true,
        tenderness: false,
        numbness: true,
        edema: true,
        swelling: true,
        reducedMotion: true,
        positioning: 'some positioning',
        coldPack: false,
        hotPack: true,
        electStim: true,
        traction: true,
        massage: true,
        technique: 'some technique',
        manipulation: true
      };

}).catch(error => console.log(error))
