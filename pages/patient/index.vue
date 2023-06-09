<template>
  <div>
    <v-container>
      <v-btn class="mb-4" @click="backToDashboard">Back to Dashboard</v-btn>
      <v-card class="elevation-4">
        <div class="py-5 d-flex">
          <v-card-title>
            Patient List
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mx-2 pa-2" @click="patientDialog = true">Add New Patient</v-btn>
        </div>
        <v-table>
          <thead>
            <tr>
              <th class="text-left" @click="sortPatients('firstName')">
                First Name
              </th>
              <th class="text-left" @click="sortPatients('lastName')">
                Last Name
              </th>
              <th class="text-left" @click="sortPatients('lastUpdated')">
                Last Updated
              </th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody class="">
            <tr
              v-for="item in displayedPatients"
              :key="item.id"
            >
              <td>{{ item.firstName }}</td>
              <td>{{ item.lastName }}</td>
              <td>{{ formatDateTime(item.lastUpdated) }}</td>
              <td class="d-flex justify-end">
                <v-icon class="ma-2 pa-3" @click="editPatientItem(item)">mdi-pencil</v-icon>
                <v-btn class="ma-2 pa-3" color="primary" @click="goToPatient(item)">See patient</v-btn>
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
    </v-container>
  <PatientDialog v-model="patientDialog" :selected-item="selectedPatientItem" @close-dialog="closePatientDialog" @patient-added="refreshPatientList" />

</div>
</template>

<script>
import PatientDialog from '~/components/dialogs/PatientDialog.vue';
import { patientStore } from '~/store/patient';
import { createPatientService } from '~/services/patient';

export default {
  name: 'PatientPage',
  components: {
      PatientDialog
  },
  data () {
      return {
          patientDialog: false,
          patientService: null,
          patients: [],
          displayedPatients: [],
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 1,
          selectedPatientItem: null,
      }
  },
  watch: {
    currentPage() {
      this.updateDisplayedPatients();
    },
  },
  async mounted() {
      this.patientStore = patientStore();
      this.patientService = createPatientService(this.$api);
      this.patients = await this.patientService.getPatients();
      this.updateDisplayedPatients();
  },
  methods: {
      async refreshPatientList() {
          this.patients = await this.patientService.getPatients();
          this.updateDisplayedPatients();
      },
      goToPatient(item) {
          this.patientStore.setCurrentPatient(item);
          this.$router.push(`/patient/${item.id}`);
      },
      editPatientItem(patient) {
        this.selectedPatientItem = patient;
        this.patientDialog = true;
      },
      backToDashboard() {
          this.$router.push('/');
      },
      closePatientDialog() {
          this.selectedPatientItem = null;
          this.patientDialog = false;
      },
      updateDisplayedPatients() {
        this.totalPages = Math.ceil(this.patients.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedPatients = this.patients.slice(startIndex, startIndex + this.itemsPerPage);
      },
      sortPatients(field) {
        this.patients = this.patients.sort((a, b) => {
          if (a[field] < b[field]) {
            return -1;
          }
          if (a[field] > b[field]) {
            return 1;
          }
          return 0;
        });
        this.updateDisplayedPatients();
      },
      formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(date);

        const formattedTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(date);

        return `${formattedDate}`;
      },
    },
  }
</script>