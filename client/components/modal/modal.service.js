'use strict';

function Modal($rootScope, $uibModal) {
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the
   *     modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal(scope, modalClass, templateUrl) {
    var modalScope = $rootScope.$new();
    scope = scope || {};
    modalClass = modalClass || 'modal-default';

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: templateUrl || 'components/modal/modal.html',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex.
       * ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex.
       *     myModalFn)
       */
      delete: function(del) {
        del = del || angular.noop;

        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight
         *     to del callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments),
            name = args.shift(),
            deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: '<p>Are you sure you want to delete <strong>' + name +
                    '</strong>?</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click: function(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function(event) {
            del.apply(event, args);
          });
        };
      },

      /**
       * Create modal and open an update confirmation modal.
       */
      update: function(model, updateType, fromValue, toValue, cb) {
        var updateModal = openModal({
          modal: {
            dismissable: true,
            title: 'Confirm ' + updateType + ' Update',
            html: '<p>Are you sure you want to update <em>' + updateType +
                  '</em> from <strong>' + fromValue +
                  '</strong> to <strong>' + toValue +
                  '</strong> for <strong>' + model.name + '</strong>?</p>',
            buttons: [{
              classes: 'btn-warning',
              text: 'Confirm',
              click: function(e, modal) {
                modal.pending = true;
                cb(model).then(function() {
                  updateModal.close();
                }, function(err) {
                  console.log(err);
                  modal.pending = false;
                });
              },
              disabled: function(modal) {
                return modal.pending;
              }
            }, {
              classes: 'btn-default',
              text: 'Cancel',
              click: function(e) {
                updateModal.dismiss(e);
              },
              disabled: function(modal) {
                return modal.pending;
              }
            }]
          }
        }, 'modal-warning');
      },

      /**
       * Create a function to open a reset confirmation modal (ex.
       * ng-click='reset()')
       * @param  {Function} rst - callback, ran when reset is confirmed
       * @return {Function}     - the function to open the modal (ex. reset)
       */
      reset: function(rst) {
        rst = rst || angular.noop;

        /** Open a update confirmation modal */
        return function() {
          var resetModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Application Reset',
              html: '<p>Are you sure you want to reset entire application? ' +
                    '<b>ALL DATA except user data will be destroyed!</b>' +
                    '</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Reset',
                click: function(e) {
                  resetModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  resetModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          resetModal.result.then(function(event) {
            rst.apply(event);
          });
        };
      }
    },

    form: function(title, templateUrl, cb) {
      var formModal = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          submitFn: function(form, model) {
            if (form.$valid) {
              cb(model).$promise.then(function() {
                formModal.close();
              }, function(err) {
                console.log(err);
                // TODO: Handle error from submitting form.
              });
            }
          },
          buttons: [{
            classes: 'btn-success',
            text: 'Submit',
            type: 'submit',
            click: angular.noop
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              formModal.dismiss(e);
            }
          }]
        },
        model: {}
      }, 'modal-success', 'components/modal/form-modal.html');
    },

    interventionEdit: function(title, model, templateUrl, cb) {
      var formModal = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          submitFn: function(form, model) {
            if (form.$valid) {
              cb(model).$promise.then(function() {
                formModal.close();
              }, function(err) {
                console.log(err);
                // TODO: Handle error from submitting form.
              });
            }
          },
          buttons: [{
            classes: 'btn-success',
            text: 'Submit',
            type: 'submit',
            click: angular.noop
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              formModal.dismiss(e);
            }
          }]
        },
        model: model
      }, 'modal-success', 'components/modal/form-modal.html');
    },

    interventionForm: function(title, types, templateUrl, cb) {
      var interventionForm = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          types: types,
          submitFn: function(form, model) {
            if (form.$valid) {
              cb(model).$promise.then(function() {
                interventionForm.close();
              }, function(err) {
                console.log(err);
                // TODO: Handle error from submitting form.
              });
            }
          },
          buttons: [{
            classes: 'btn-success',
            text: 'Submit',
            type: 'submit',
            click: angular.noop
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              interventionForm.dismiss(e);
            }
          }]
        },
        model: {}
      }, 'modal-success', 'components/modal/form-modal.html');
    },

    confirmDelete: function(title, templateUrl, model, cb) {
      var confirmDelete = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          submitFn: function(form, model) {
            cb(model).$promise.then(function() {
              confirmDelete.close();
            }, function(err) {
              console.log(err);
              // TODO: Handle error from deleting.
            });
          },
          buttons: [{
            classes: 'btn-danger',
            text: 'Delete',
            type: 'submit'
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              confirmDelete.dismiss(e);
            }
          }]
        },
        model: model
      }, 'modal-danger', 'components/modal/form-modal.html');
    },

    confirmDeleteGuarded: function(title, templateUrl, model, guard, cb) {
      var confirmDelete = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          buttons: [{
            classes: 'btn-danger',
            text: 'Delete',
            click: function(event, modal) {
              modal.pending = true;
              cb(model).$promise.then(function() {
                confirmDelete.close();
              }, function(err) {
                modal.pending = false;
                console.log(err);
                // TODO: Handle error from deleting.
              });
            },
            disabled: function(modal) {
              return modal.pending || (modal.confirm || '').toLowerCase() !==
                                      guard.toLowerCase();
            }
          }, {
            classes: 'btn-default',
            text: 'Cancel',
            click: function(e) {
              confirmDelete.dismiss(e);
            },
            disabled: function(modal) {
              return modal.pending;
            }
          }]
        },
        model: model
      }, 'modal-danger', 'components/modal/modal.html');
    },

    viewNote: function(title, templateUrl, note) {
      var viewNote = openModal({
        modal: {
          dismissable: true,
          title: title,
          templateUrl: templateUrl,
          note: note,
          buttons: [{
            classes: 'btn-default',
            text: 'Close',
            click: function(e) {
              viewNote.dismiss(e);
            }
          }]
        },
      }, 'modal-info', 'components/modal/form-modal.html');
    }
  };
}

angular.module('app').factory('Modal', Modal);
