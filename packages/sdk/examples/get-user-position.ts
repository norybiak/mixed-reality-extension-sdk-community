import * as MRE from 'mixed-reality-extension-sdk-community';

interface Users {
	asvrUser: MRE.User,
	previousPos: MRE.Vector3,
	trackerActor: MRE.Actor,
	posTextActor: MRE.Actor
}

export default class App {

	private users = new Map<string, Users>();
	private interval: NodeJS.Timer;

	constructor(private context: MRE.Context) {

		this.context.onStarted(() => this.started());
		this.context.onUserJoined((user) => this.userJoined(user));

	}

	private started() {

		this.getUserPositions();

	}

	private userJoined(asvrUser: MRE.User) {

		const trackerActor = MRE.Actor.Create(this.context, {
			actor: {
				name: "Anchor",
				attachment: {
					attachPoint: "hips",
					userId: asvrUser.id
				},
				subscriptions: ['transform'],
			}
		});

		const posTextActor = MRE.Actor.Create(this.context, {
			actor: {
				name: 'Text',
				transform: {
					local: {
						position: { x: 0, y: 1.5, z: 0 },
						rotation: MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), 180 * MRE.DegreesToRadians)
					}
				},
				parentId: trackerActor.id,
				text: {
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					justify: MRE.TextJustify.Center,
					height: 0.1,
					contents: "x: 0, y: 0, z: 0"
				}
			}
		});

		const user: Users = {
			asvrUser,
			previousPos: MRE.Vector3.Zero(),
			trackerActor,
			posTextActor
		}

		this.users.set(asvrUser.id.toString(), user);

	}

	private getUserPositions() {

		this.interval = setInterval(() => {
			this.users.forEach((user) => {
				let currentPos = user.trackerActor.transform.app.position;
				if (!user.previousPos.equals(currentPos)) {
					user.posTextActor.text.contents = `x: ${currentPos.x}, y: ${currentPos.y}, z: ${currentPos.z}`;
					user.previousPos.copyFrom(currentPos);
				}
			});
		}, 0);

	}

}