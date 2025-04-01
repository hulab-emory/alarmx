import axios from "axios";

// export const getProjects = (setLoading) => async (dispatch) => {
//   const url = "/api/cada/project";
//   setLoading(true);

//   try {
//     const response = await axios.get(url);
//     const projects = response.data;

//     dispatch({
//       type: GET_PROJECTS,
//       projects,
//     });

//     setLoading(false);
//   } catch (err) {
//     setLoading(false);
//     console.log(err);

//     const errorMessage =
//       err.response && err
//         ? err
//         : "An error occurred";

//     dispatch({
//       type: UPDATE_ALERT,
//       alert: { message: errorMessage, severity: "warning" },
//     });

//     setTimeout(() => {
//       dispatch({ type: RESET_ALERT });
//     }, 3000);
//   }
// };


export const getProjects = () => (dispatch) => {
  let url = `/api/cada/project`;
  console.log(url);
  axios({ method: "get", url })
    .then((response) => {
      dispatch({
        type: "GET_PROJECTS",
        projects: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getUserProjects = (uid) => (dispatch) => {
  let url = `/api/cada/project/users/${uid}`;
  console.log(url);

  axios({ method: "get", url })
    .then((response) => {
      let proj = {};
      let roles = [];
      response.data.map((p) => {
        proj[p.id] = p;
        roles = roles.concat(p.cadaProjectUsers);
      });
      dispatch({ type: "GET_USER_PROJECTS", userProjects: proj });
      dispatch({ type: "GET_USER_ROLES", userRoles: roles });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    }
    );
}

export const addProject = (payload) => (dispatch) => {
  let url = `/api/cada/project`;
  console.log(url, payload);
  axios({ method: "post", url, data: payload })
    .then((response) => {
      dispatch({
        type: "ADD_PROJECT",
        project: response.data,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: "New project added! ", severity: "success" },
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const updateProject = (id, payload) => (dispatch) => {
  let url = `/api/cada/project/${id}`;
  console.log(url);
  axios({ method: "put", url, data: payload })
    .then((response) => {
      dispatch({
        type: "UPDATE_PROJECT",
        project: response.data,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: "Project updated! ", severity: "success" },
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const removeProject = (id) => (dispatch) => {
  let url = `/api/cada/project/${id}`;
  console.log(url);
  axios({ method: "delete", url })
    .then((response) => {
      dispatch({
        type: "REMOVE_PROJECT",
        id: response.data,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: "Project removed! ", severity: "success" },
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getUsers = (payload) => (dispatch) => {
  let url = `/api/user/search`;
  console.log(url, payload);
  axios({ method: "post", url, data: payload })
    .then((response) => {
      dispatch({
        type: "GET_USERS",
        users: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const addUser = (payload) => (dispatch) => {
  let url = `/api/feature/1/users`;
  console.log(url, payload);

  axios({ method: "post", url, data: payload })
    .then((response) => {
      dispatch({
        type: "ADD_USER",
        user: response.data,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: "New user added! ", severity: "success" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const updateUser = (payload) => (dispatch) => {
  let url = `/api/feature/1/users`;
  console.log(url, payload);

  axios({ method: "post", url, data: payload })
    .then((response) => {
      dispatch({
        type: "ADD_USER",
        user: response.data,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: "New user added! ", severity: "success" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const removeUser = (userId) => (dispatch) => {
  let url = `/api/feature/1/users/${userId}`;
  console.log(url);
  axios
    .delete(url)
    .then((response) => {
      dispatch({
        type: "REMOVE_USER",
        userId: userId,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: "User removed! ", severity: "success" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getEventsCount = (projectId) => (dispatch) => {
  let url = `/api/cada/event/count?pid=${projectId}`;
  console.log(url);
  axios({ method: "get", url })
    .then((response) => {
      dispatch({
        type: "GET_ANN_EVENTS_COUNT",
        eventsCount: response.data,
        projectId: projectId,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getBuckets = (path) => (dispatch) => {
  let url = `/api/bucket/${path}`;
  console.log(url);
  axios({ method: "get", url })
    .then((response) => {
      console.log(response)
      dispatch({
        type: "GET_BUCKETS",
        buckets: response.data,
        path: path,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const removeProjectUser = (payload) => (dispatch) => {
  let url = `/api/cada/project/${payload.cadaProjectId}/users/${payload.userId}?role=${payload.role}`;
  console.log(url);
  axios
    .delete(url)
    .then((response) => {
      dispatch({
        type: "REMOVE_PROJECT_USER",
        message: response.data,
        payload,
      });
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: response.data, severity: "success" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getAnnotationEvents = (id, userId, sinceId, showCompleted = false) => (dispatch) => {
  let url = `/api/cada/event/assignments?pid=${id}&uid=${userId}${showCompleted ? '' : '&completed=0'}&sinceId=${sinceId}`;
  console.log(url);

  axios({ method: "get", url })
    .then((response) => {
      dispatch({
        type: "GET_ANN_EVENTS",
        projectId: id,
        sinceId: sinceId,
        events: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getAdjudicationEvents = (projectId) => (dispatch) => {
  let url = `/api/cada/event?pid=${projectId}&completed=1`;
  console.log(url);
  axios({ method: "get", url })
    .then((response) => {
      console.log(response.data)
      dispatch({
        type: "GET_ADJ_EVENTS",
        projectId: projectId,
        events: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const getAnnotators = (eIds) => (dispatch) => {
  let url = `/api/cada/event/annotators`;
  console.log(url, eIds);
  axios({ method: "post", url, data: eIds })
    .then((response) => {
      dispatch({
        type: "GET_ANNOTATORS",
        users: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    });
};

export const updateAnnotation =
  (projectId, eventId, completed, annotation) => (dispatch) => {
    let url = `/api/cada/event/annotationValue`;
    console.log(url, projectId, eventId, completed, annotation);
    axios({ method: "post", url, data: annotation })
      .then((response) => {
        console.log("response:", response);
        dispatch({
          type: "UPDATE_ANNOTATION",
          annotation: response.data,
          projectId: projectId,
          eventId: eventId,
          completed
        });
        if (completed === true) {
          dispatch({
            type: "UPDATE_ALERT",
            alert: { message: "Annotation updated! ", severity: "success" },
          });
          setTimeout(() => {
            dispatch({ type: "RESET_ALERT" });
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: "UPDATE_ALERT",
          alert: { message: err, severity: "warning" },
        });
        setTimeout(() => {
          dispatch({ type: "RESET_ALERT" });
        }, 3000);
      });
  };

export const getAnnotatorProgress = (pid, excludeIds = []) => (dispatch) => {
  let url = `/api/cada/event/progress/${pid}`;
  console.log(url);

  axios({ method: "get", url })
    .then((response) => {
      const progress = {};
      response.data.forEach((p) => {
        if (!excludeIds.includes(p.user.id)) {
          if (progress?.[p.userId]) {
            progress[p.userId].push(p);
            return;
          }
          progress[p.userId] = [p];
        }
      });

      dispatch({
        type: "UPDATE_ANNOTATOR_PROGRESS",
        projectId: pid,
        progress: progress,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "UPDATE_ALERT",
        alert: { message: err, severity: "warning" },
      });
      setTimeout(() => {
        dispatch({ type: "RESET_ALERT" });
      }, 3000);
    }
    );
};

export const updateAdjudication =
  (projectId, eventId, userId, completed, adjudication) => (dispatch) => {
    let url = `/api/cada/event/adjudicationValue`;
    axios({ method: "post", url, data: adjudication })
      .then((response) => {
        dispatch({
          type: "UPDATE_ADJUDICATION",
          adjudication: response.data,
          projectId,
          eventId,
          userId,
          completed,
        });
        if (completed === true) {
          dispatch({
            type: "UPDATE_ALERT",
            alert: {
              message: "Adjudication updated! ",
              severity: "success",
            },
          });
          setTimeout(() => {
            dispatch({ type: "RESET_ALERT" });
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: "UPDATE_ALERT",
          alert: { message: err, severity: "warning" },
        });
        setTimeout(() => {
          dispatch({ type: "RESET_ALERT" });
        }, 3000);
      });
  };
