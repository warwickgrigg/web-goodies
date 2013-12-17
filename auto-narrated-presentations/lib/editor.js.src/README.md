
Timeline Editor
=================

This class provides the interface to design timeline-based animations. The class structure
is designed in a way to be reusable both by the editor and the run-time object.

Object relations
=================

	  [SceneObject]
           ^
		   | (Controls)
		   |
	[TimelineObject] --(Visualized with)--> [TimelineVisualObject]