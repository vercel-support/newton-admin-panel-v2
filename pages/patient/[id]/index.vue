<template>
    <div>
      <v-container>
        <v-btn class="mx-5 mb-4" @click="backToPatients()">Back to Patient List</v-btn>

        <v-row>
          <v-col cols="8">

            <v-card class="elevation-4 mx-5 my-5">
              <div class="py-5 d-flex">
                <v-card-title>
                  Notes List
                </v-card-title>
                <v-spacer></v-spacer>
                <v-row class="mx-2 pa-2" justify="end">
                    <v-btn color="primary" @click="dialog = true">Add New Note</v-btn>
                    <NoteDialog v-model="dialog"  @note-added="refreshNotes" @close-dialog="closeNoteDialog" />
                </v-row>
              </div>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">
                      Visit Date
                    </th>
                    <th class="text-left">
                      Room Assignment
                    </th>
                    <th class="text-left">
                    </th>
                  </tr>
                </thead>
                <tbody class="">
                  <tr
                    v-for="item in shownNotes"
                    :key="item.id"
                  >
                    <td>{{ formatDate(item.visitDate) }}</td>
                    <td>{{ item.roomAssignment }}</td>
                    <td class="d-flex justify-end">
                      <v-menu
                        transition="slide-x-transition"
                      >
                        <template #activator="{ props }">
                          <v-btn
                            class="ma-2 pa-2"
                            v-bind="props"
                          >
                            Export
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item
                            v-for="(exportItem, i) in exportItems"
                            :key="i"
                            @click="handleExport(exportItem.type, item)"
                          >
                            <v-list-item-title>{{ exportItem.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <v-btn class="ma-2 pa-2" color="primary" @click="goToNote(item)">See Note</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                color="primary"
              ></v-pagination>
            </v-card>
          </v-col>
          <v-col cols="4">
                <v-card class="px-5 mx-5 my-5">
                    <div class="d-flex align-center justify-space-around py-16">
                        <v-avatar color="info" size="x-large">
                          {{currentPatient?.firstName[0]}}{{currentPatient?.lastName[0]}}
                        </v-avatar>
                    </div>
                    <div class="d-flex align-center justify-space-around">
                      <v-col cols="4">
                        <v-label class="">First Name</v-label>
                      </v-col>
                      <v-col cols="8">
                        <v-card-text>{{currentPatient?.firstName}}</v-card-text>
                      </v-col>
                    </div>
                    <div class="d-flex align-center justify-space-around">
                      <v-col cols="4">
                        <v-label class="">Last Name</v-label>
                      </v-col>
                      <v-col cols="8">
                        <v-card-text>{{currentPatient?.lastName}}</v-card-text>
                      </v-col>
                    </div>
                    <div class="d-flex align-center justify-space-around">
                      <v-col cols="4">
                        <v-label class="">Email</v-label>
                      </v-col>
                      <v-col cols="8">
                        <v-card-text>{{currentPatient?.email}}</v-card-text>
                      </v-col>
                    </div>
                    <div class="d-flex align-center justify-space-around">
                      <v-col cols="4">
                        <v-label class="">Phone</v-label>
                      </v-col>
                      <v-col cols="8">
                        <v-card-text class="">{{currentPatient?.phoneNumber}}</v-card-text>
                      </v-col>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-card class="elevation-4 mx-5 my-5">
              <div class="py-5 d-flex">
                <v-card-title>
                  Complaints List
                </v-card-title>
                <v-spacer></v-spacer>
                <v-row class="mx-2 pa-2" justify="end">
                  <v-btn color="primary" @click="complaintDialog = true">Add New Complaint</v-btn>
                  <PatientComplaintDialog v-model="complaintDialog" :selected-item="selectedComplaintItem" @complaint-added="refreshComplaints" @close-dialog="closeComplaintDialog" />
                </v-row>
              </div>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">
                      Text
                    </th>
                    <th class="text-left">
                      Pain Level
                    </th>
                    <th class="text-left">
                      Last Edited
                    </th>
                    <th class="text-left">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in shownComplaints"
                    :key="item.id"
                  >
                    <td>{{ item.text }}</td>
                    <td>{{ item.painLevel }}</td>
                    <td>{{ formatDate(item.lastEdited) }}</td>
                    <td class="d-flex justify-end">
                      <v-icon class="ma-2 pa-2 pencil-edit" @click="editComplaintItem(item)">mdi-pencil</v-icon>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-pagination
                v-model="complaintCurrentPage"
                :length="complaintTotalPages"
                :total-visible="5"
                color="primary"
              ></v-pagination>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import { patientStore } from '~/store/patient';
  import { noteStore } from '~/store/note';
  import { createPatientService } from '~/services/patient';
  import { createNoteService } from '~/services/note';
  import { createEntryService } from '~/services/entry';
  import {createComplaintService} from '~/services/complaint';
  import NoteDialog from '~/components/dialogs/NoteDialog.vue';
  import { generateCSV, generateXLSX } from '~/utils/csvExport';
  import PatientComplaintDialog from '~/components/dialogs/PatientComplaintDialog.vue';

  export default {
    name: 'PatientPage',
    components: {
      NoteDialog,
      PatientComplaintDialog
    },
    data() {
      return {
        notes: [],
        patientStore: null,
        noteStore: null,
        dialog: false,
        patientService: null,
        noteService: null,
        entryService: null,
        complaintService: null,
        payload: null,
        exportItems: [
          { title: 'Export as CSV', type: 'csv' },
          { title: 'Export as Excel', type: 'excel' },
        ],
        itemsPerPage: 6,
        currentPage: 1,
        totalPages: 1,
        displayedNotes: [],
        complaints: [],
        complaintDialog: false,
        complaintCurrentPage: 1,
        complaintTotalPages: 1,
        displayedComplaints: [],
        selectedComplaintItem: null,
      };
    },
    computed: {
      currentPatient() {
        return this.patientStore?.getCurrentPatient
      },
      shownNotes() {
        return this.displayedNotes;
      },
      shownComplaints() {
        return this.displayedComplaints;
      }
    },
    watch: {
      currentPage() {
        this.updateDisplayedNotes();
      },
    },
    async mounted() {
      this.patientStore = patientStore();
      await this.getCurrentPatient();
      this.noteStore = noteStore();
      this.noteService = createNoteService(this.$api);
      this.entryService = createEntryService(this.$api);
      this.complaintService = createComplaintService(this.$api);
      this.notes = await this.noteService.getNotesForPatient({ patientId: this.$route.params.id });
      this.updateDisplayedNotes();
      this.complaints = await this.complaintService.getComplaintsForPatient({ patientId: this.$route.params.id });
      this.updateDisplayedComplaints();
    },
    methods: {
      updateDisplayedNotes() {
        // sort notes based on createdDate in descending order
        this.notes.sort((a, b) => {
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        this.totalPages = Math.ceil(this.notes.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedNotes = this.notes.slice(startIndex, startIndex + this.itemsPerPage);
      },
      async handleExport(type, item) {
        await this.assignPayload(item);
        if (type === 'csv') {
          generateCSV(this.payload);
        } else if (type === 'excel') {
          generateXLSX(this.payload);
        }
      },
      async assignPayload(note) {
        // 1. get list of entries for note
        const entries = await this.entryService.getEntriesForNote({
          noteId: note.id,
        });

        // 2. construct the payload
        let payload = entries.reduce((acc, entry) => {
          const key = entry.spinalLevel || entry.extremityLevel;
          if (!acc[key]) {
            acc[key] = {
              sides: {},
              of: {},
              physio: {},
              treatment: {},
            };
          }

          acc[key].sides[entry.side] = true;
          acc[key].of.sublux = entry.sublux
          acc[key].of.muscleSpasm = entry.muscleSpasm;
          acc[key].of.triggerPoints = entry.triggerPoints;
          acc[key].of.tenderness = entry.tenderness;
          acc[key].of.numbness = entry.numbness;
          acc[key].of.edema = entry.edema;
          acc[key].of.swelling = entry.swelling;
          acc[key].of.reducedMotion = entry.reducedMotion;
          acc[key].physio.positioning = entry.physioPositioning;
          acc[key].physio.coldPack = entry.coldPack;
          acc[key].physio.hotPack = entry.hotPack;
          acc[key].physio.electStim = entry.electStim;
          acc[key].physio.traction = entry.traction;
          acc[key].physio.massage = entry.massage;
          acc[key].treatment.positioning = entry.treatmentPositioning;
          acc[key].treatment.technique = entry.technique;
          acc[key].treatment.manipulation = entry.manipulation;

          return acc;
        }, {});
        payload.roomAssignments = {
          physio: "",
          tx: "",
        };
        const currentPatient = await this.getCurrentPatient();
        payload.patientFirstName = currentPatient.firstName;
        payload.patientLastName = currentPatient.lastName;
        payload.noteVisitDate = note.visitDate || "";
        payload.height = `${note.heightFeet || ""}'${note.heightInches || ""}"` || "";
        payload.weight = `${note.weight || ""} lbs`;
        payload.temperature = `${note.temperature} F` || "";
        payload.systolic = note.systolic || "";
        payload.diastoic = note.diastoic || "";
        payload.respiration = note.respiration || "";
        payload.physiotherapyNumber = note.physiotherapy || ""
        payload.roomAssignments.physio = note.physio || "";
        payload.roomAssignments.tx = note.tx || "";

        this.payload = payload;
      },
      backToPatients() {
        this.$router.push('/patient');
      },
      goToNote(item) {
        this.noteStore.setCurrentNote(item);
        this.$router.push(`/patient/${this.$route.params.id}/note/${item.id}`);
      },
      async refreshNotes() {
        this.notes = await this.noteService.getNotesForPatient({ patientId: this.$route.params.id });
        this.updateDisplayedNotes();
      },
      editComplaintItem(complaint) {
        this.complaintDialog = true;
        this.selectedComplaintItem = complaint;
      },
      closeNoteDialog() {
        this.dialog = false;
      },
      formatDate(date) {
            if (isNaN(Date.parse(date))) {
                return "Invalid date";
            }

            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(new Date(date));

            return `${formattedDate}`;
        },
        async getCurrentPatient() {
            this.patientService = createPatientService(this.$api);
            const patient = await this.patientService.getPatient({
                id: this.$route.params.id,
            });
            this.patientStore.setCurrentPatient(patient);
            return patient;
        },
        updateDisplayedComplaints() {
          // sort complaints based on lastUpdated in descending order
          this.complaints.sort((a, b) => {
            return new Date(b.lastEdited) - new Date(a.lastEdited);
          });
          this.complaintTotalPages = Math.ceil(this.complaints.length / this.itemsPerPage);
          const startIndex = (this.complaintCurrentPage - 1) * this.itemsPerPage;
          this.displayedComplaints = this.complaints.slice(startIndex, startIndex + this.itemsPerPage);
        },
        async refreshComplaints() {
          this.complaints = await this.complaintService.getComplaintsForPatient({ patientId: this.$route.params.id });
          this.updateDisplayedComplaints();
        },
        closeComplaintDialog() {
          this.complaintDialog = false;
        },
      },
  };
  </script>
  
<style scoped>
    tbody tr {
        height: 50px;
    }
</style>