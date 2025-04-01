import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Adjudication from './Adjudication';
import Annotation from './Annotation';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProjects } from '../../redux/actions';

export default function Note() {
  const { pid, role } = useParams();
  const project = useSelector((state) => state.cada.userProjects[pid]);
  const user = useSelector((state) => state.main.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!project) {
      dispatch(getUserProjects(user.id));
    }
  }, [project]);

  return (
    <>
      {role === "adjudicator" ? (
        <Adjudication pid={parseInt(pid, 10)} />
      ) : (
        <Annotation
          pid={parseInt(pid, 10)} />
      )}
    </>
  )
}
